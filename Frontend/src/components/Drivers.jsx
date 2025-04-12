import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Drivers = () => {
  const { requestId } = useParams();
  const location = useLocation();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedDriver, setAssignedDriver] = useState(null); // Track assigned driver
  const [isRequestLocked, setIsRequestLocked] = useState(false); // Lock UI for the request

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL_USER}/api/drivers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("admin:admin123"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const updatedDrivers = data.map(driver => ({
            ...driver,
            assignedRequestsCount: driver.assignedRequestsCount || 0, // Ensure it's initialized
          }));
          setDrivers(updatedDrivers);
          setLoading(false);
        } else {
          console.error("Failed to fetch drivers", response.status);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  // Load assigned driver from localStorage
  useEffect(() => {
    const storedAssignedDriver = localStorage.getItem(`assignedDriver_${requestId}`);
    if (storedAssignedDriver) {
      setAssignedDriver(storedAssignedDriver);
      setIsRequestLocked(true);
    }
  }, [requestId]);

  // Assign request
  const handleAssignRequest = async (driverId, driverName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL_USER}/api/requests/${requestId}/assign-driver/${driverName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("admin:admin123"),
          },
        }
      );

      if (response.ok) {
        console.log("Driver assigned successfully");

        // Lock UI and update driver state
        setAssignedDriver(driverName);
        setIsRequestLocked(true);

        // Update driver availability to "Busy"
        setDrivers(prevDrivers =>
          prevDrivers.map(driver =>
            driver.id === driverId
              ? { ...driver, availabilityStatus: "BUSY", assignedRequestsCount: driver.assignedRequestsCount + 1 }
              : driver
          )
        );

        localStorage.setItem(`assignedDriver_${requestId}`, driverName);
      } else {
        console.error("Failed to assign driver", response.status);
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  // Delete driver
  const handleDeleteDriver = async (driverId, driverName) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${driverName}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL_USER}/api/drivers/${driverId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + btoa("admin:admin123"),
            },
          }
        );

        if (response.ok) {
          console.log("Driver deleted successfully");

          setDrivers((prevDrivers) =>
            prevDrivers.filter((driver) => driver.id !== driverId)
          );

          if (assignedDriver === driverName) {
            localStorage.removeItem(`assignedDriver_${requestId}`);
            setAssignedDriver(null);
            setIsRequestLocked(false);
          }

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: `${driverName} has been deleted.`,
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          console.error("Failed to delete driver", response.status);
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading drivers...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <h2 style={{ width: "100%", textAlign: "center", marginBottom: "20px" }}>
        Assign Driver to Request ID: {requestId}
      </h2>
      {drivers.map((driver) => (
        <div
          key={driver.id}
          style={{
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            backgroundColor: "#d1f7d1", // Pista color
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
            {driver.name}
          </h3>
          <p style={{ margin: "5px 0" }}>
            Vehicle Number: {driver.vehicleNumber}
          </p>

          {/* Driver Availability */}
          <p style={{ margin: "5px 0" }}>
            Status:{" "}
            <span
              style={{
                color:
                  driver.availabilityStatus === "Available"
                    ? "green"
                    : driver.availabilityStatus === "BUSY"
                    ? "red"
                    : "gray", // Red for BUSY, Green for Available, Gray for undefined
                fontWeight: "bold",
              }}
            >
              {driver.availabilityStatus}
            </span>
          </p>

          {assignedDriver === driver.name ? (
            <button
              style={{
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "8px 16px",
                fontSize: "14px",
                borderRadius: "4px",
                cursor: "not-allowed",
                marginBottom: "10px",
              }}
              disabled
            >
              Assigned
            </button>
          ) : (
            <button
              style={{
                backgroundColor: isRequestLocked ? "gray" : "blue",
                color: "white",
                border: "none",
                padding: "8px 16px",
                fontSize: "14px",
                borderRadius: "4px",
                cursor: isRequestLocked ? "not-allowed" : "pointer",
                marginBottom: "10px",
              }}
              onClick={() => handleAssignRequest(driver.id, driver.name)}
              disabled={isRequestLocked}
            >
              Assign Request
            </button>
          )}

          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "8px 16px",
              fontSize: "14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => handleDeleteDriver(driver.id, driver.name)}
          >
            Delete Driver
          </button>
        </div>
      ))}
    </div>
  );
};

export default Drivers;
