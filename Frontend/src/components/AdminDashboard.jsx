import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function AdminDashboard() {
  const [allRequests, setAllRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("AVAILABLE");

  const navigate = useNavigate();

  // Fetch all requests
  const fetchAllRequests = async () => {
    setLoadingRequests(true);
    try {
      const username = "admin";
      const password = "admin123";
      const base64Credentials = btoa(`${username}:${password}`);
      const response = await fetch(`${process.env.REACT_APP_API_URL_USER}/api/requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllRequests(data);
      } else {
        throw new Error("Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching all requests:", error);
      alert("Unable to load requests. Please check backend connectivity.");
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_USER}/api/users/role/DRIVER`, {
        method: "GET",
        headers: {
          Authorization: "Basic " + btoa("admin:admin123"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedDrivers = data.map((driver) => {
          const [id, name] = driver.split(":");
          return { id, name };
        });
        setDrivers(formattedDrivers);
      } else {
        console.error("Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Handle driver selection
  const handleDriverSelect = (event) => {
    const selectedDriverId = event.target.value;
    const selectedDriver = drivers.find(driver => driver.id === selectedDriverId)?.name || "";
    setSelectedDriver(selectedDriver);

    localStorage.setItem("selectedDriverId", selectedDriverId);
    localStorage.setItem("selectedDriver", selectedDriver);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const driverId = localStorage.getItem("selectedDriverId");
    const driver = localStorage.getItem("selectedDriver");

    if (!driverId || !vehicleNumber) {
      alert("Please select a driver and enter a vehicle number.");
      return;
    }

    const requestData = {
      user: { id: Number(driverId) },
      name: driver,
      vehicleNumber: vehicleNumber,
      availabilityStatus: availabilityStatus,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_USER}/api/adddrivers`, {

    
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:admin123"),
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // Show success message using SweetAlert in toast format
        Swal.fire({
          icon: 'success',
          title: 'Driver Assigned',
          text: 'Driver has been successfully Added.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });

        const updateAvailabilityResponse = await fetch(
          `${process.env.REACT_APP_API_URL_USER}/api/update-availability/${driver}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("admin:admin123"),
            },
          }
        );

        if (updateAvailabilityResponse.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Driver Availability Updated',
            text: 'Driver availability updated to BUSY.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });

          setAllRequests(prevRequests =>
            prevRequests.map(request =>
              request.id === requestData.id
                ? { ...request, status: "NO ACTION REQUIRED" }
                : request
            )
          );
        } else {
          alert("Failed to update driver's availability.");
        }

        setFormVisible(false);
      } else {
        alert("Failed to assign driver");
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Unable to assign driver. Please try again.");
    }
  };

  const handleAssignDriver = async (requestId) => {
    try {
      navigate(`/driver-assignment/${requestId}`);
      setAllRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, driverAssigned: true }
            : request
        )
      );
    } catch (error) {
      console.error("Error assigning driver:", error);
      alert("Unable to assign driver. Please try again.");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    // Show SweetAlert confirmation prompt
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL_USER}/api/requests/${requestId}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa('admin:admin123'),
              },
            }
          );

          if (response.ok) {
            Swal.fire('Deleted!', 'The request has been deleted.', 'success');
            setAllRequests((prevRequests) =>
              prevRequests.filter((request) => request.id !== requestId)
            );
          } else {
            Swal.fire('Error', 'Failed to delete the request.', 'error');
          }
        } catch (error) {
          console.error('Error deleting request:', error);
          Swal.fire('Error', 'Unable to delete the request. Please try again.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchAllRequests();
    fetchDrivers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard - All Submitted Requests</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => setFormVisible(true)}>
          Add Driver
        </button>
      </div>

      {loadingRequests ? (
        <p>Loading requests...</p>
      ) : allRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User Name</th>
              <th>Waste Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action Required</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user?.name || "N/A"}</td>
                <td>{request.wasteType}</td>
                <td>{request.location}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === "PENDING" || request.status !== "COMPLETED" ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleAssignDriver(request.id)}
                    >
                      Assign Driver
                    </button>
                  ) : (
                    <span>Driver Assigned</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    Delete Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isFormVisible && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Driver</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setFormVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="driverName" className="form-label">
                      Driver Name
                    </label>
                    <select
                      id="driverName"
                      className="form-control"
                      value={selectedDriver}
                      onChange={handleDriverSelect}
                    >
                      <option value="">Select a Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="vehicleNumber" className="form-label">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      id="vehicleNumber"
                      className="form-control"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="availabilityStatus" className="form-label">
                      Availability Status
                    </label>
                    <select
                      id="availabilityStatus"
                      className="form-control"
                      value={availabilityStatus}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="BUSY">BUSY</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
