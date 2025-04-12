import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserDashboard = () => {
  const [location, setLocation] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Redirect non-user roles
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "ADMIN" || role === "DRIVER") {
      Swal.fire({
        icon: "error",
        title: "Access Restricted",
        text: "You do not have access to the User Dashboard.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      if (role === "ADMIN") window.location.href = "/admin";
      else if (role === "DRIVER") window.location.href = "/driver";
    }
  }, []);

  // Fetch user requests
  const fetchUserRequests = async () => {
    setLoadingRequests(true);
    try {
      const name = localStorage.getItem("name");
      if (!name) throw new Error("User is not logged in.");

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_USER}/api/requests/user/name/${name}`,
        {
          headers: {
            Authorization: `Basic ${btoa("user:user123")}`,
          },
        }
      );

      if (response.status === 200) {
        setRequests(response.data);
      } else {
        throw new Error("Failed to fetch requests.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch your requests.",
      });
    } finally {
      setLoadingRequests(false);
    }
  };

  // Submit a new request
  const handleSubmitRequest = async () => {
    const name = localStorage.getItem("name");
    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to submit a request.",
      });
      return;
    }

    if (!wasteType || !location) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please provide a description and address.",
      });
      return;
    }

    try {
      const requestData = { name, wasteType, location, status: "PENDING" };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_USER}/api/users/requests/${name}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa("user:user123")}`,
          },
        }
      );

      if (response.status === 201) {
        setRequests((prev) => [...prev, response.data]);
        Swal.fire({
          icon: "success",
          title: "Request Submitted",
          text: "Your request has been submitted!",
        });
        setWasteType("");
        setLocation("");
      } else {
        throw new Error("Failed to submit request.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Failed to submit your request.",
      });
    }
  };

  // Delete request handler
  const handleDeleteRequest = async (requestId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL_USER}/api/requests/${requestId}`,
          {
            headers: {
              Authorization: `Basic ${btoa("user:user123")}`,
            },
          }
        );

        if (response.status === 204) {
          setRequests((prev) => prev.filter((req) => req.id !== requestId));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your request has been deleted.",
          });
        } else {
          throw new Error("Failed to delete the request.");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to delete the request.",
        });
      }
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2>User Dashboard - Report Garbage</h2>
      <div className="card p-4">
        <div className="mb-3">
          <label>Exact Address</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter address"
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            placeholder="Describe the garbage issue"
          ></textarea>
        </div>
        <button className="btn btn-primary" onClick={handleSubmitRequest}>
          Submit Request
        </button>
      </div>

      <h3 className="mt-4">Your Submitted Requests</h3>
      {loadingRequests ? (
        <p>Loading requests...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.wasteType}</td>
                <td>
                  <span
                    style={{
                      color: req.status === "COMPLETED" ? "green" : "black",
                      fontWeight: req.status === "COMPLETED" ? "bold" : "normal",
                    }}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRequest(req.id)}
                  >
                    Delete Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;
