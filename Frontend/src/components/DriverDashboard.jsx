import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const DriverDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn] = useState(!!localStorage.getItem("name")); // Removed setIsLoggedIn
  const navigate = useNavigate();
  const driverName = localStorage.getItem("name"); // Get logged-in driver name
  const authHeader = `Basic ${btoa("driver:driver123")}`; // Basic Auth header

  // Fetch assigned requests for the logged-in driver
  const fetchAssignedRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL_USER}/api/driver/${driverName}`,
        {
          headers: {
            Authorization: authHeader, // Sending Basic Auth header
          },
        }
      );

      if (response.status === 200) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching assigned requests:", error);
      alert("Failed to load requests. Please check backend connectivity.");
    } finally {
      setLoading(false);
    }
  }, [driverName, authHeader]); // Include dependencies

  // Handle request completion
  const handleCompletion = async (requestId) => {
    // SweetAlert confirmation before completing the request
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to mark this request as completed?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, complete it!',
      cancelButtonText: 'No, keep it pending',
    });

    if (result.isConfirmed) {
      // Show a prompt to confirm if the request was actually completed
      const completedConfirmation = await Swal.fire({
        title: 'Confirm Completion',
        text: "Was the request completed successfully?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, it was completed!',
        cancelButtonText: 'No, not completed',
      });

      if (completedConfirmation.isConfirmed) {
        try {
          // First endpoint: Update status to "COMPLETED"
          const responseStatus1 = await axios.put(
            `${process.env.REACT_APP_API_URL_USER}/api/drivers/${requestId}/update-status/COMPLETED`,
            {},
            {
              headers: {
                Authorization: authHeader, // Sending Basic Auth header
              },
            }
          );

          if (responseStatus1.status === 200) {
            setSuccessMessage("Request marked as completed!");

            // Update local state for the first request update
            setRequests((prevRequests) =>
              prevRequests.map((request) =>
                request.id === requestId
                  ? { ...request, status: "COMPLETED" }
                  : request
              )
            );

            // Show a success toast notification using SweetAlert2
            Swal.fire({
              icon: 'success',
              title: 'Request Completed',
              text: 'The request has been successfully marked as completed!',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
            });
          }

          // Second endpoint: Update status to "COMPLETED"
          const responseStatus2 = await axios.put(
            `${process.env.REACT_APP_API_URL_USER}/api/requests/${requestId}/status`,
            { status: "COMPLETED" },
            {
              headers: {
                Authorization: authHeader, // Sending Basic Auth header
              },
            }
          );

          if (responseStatus2.status === 200) {
            setRequests((prevRequests) =>
              prevRequests.map((request) =>
                request.id === requestId
                  ? { ...request, status: "COMPLETED" }
                  : request
              )
            );
          }
        } catch (error) {
          console.error("Error updating request status:", error);
          alert("Failed to update status. Please try again.");
        }
      } else {
        // If not confirmed, display a cancellation message
        Swal.fire({
          icon: 'info',
          title: 'Request Not Completed',
          text: 'The request was not marked as completed.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  // Handle request in-progress
  const handleInProgress = async (requestId) => {
    if (window.confirm("Are you sure you want to mark this request as in-progress?")) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL_USER}/api/requests/${requestId}/in-progress`,
          {},
          {
            headers: {
              Authorization: authHeader, // Sending Basic Auth header
            },
          }
        );

        if (response.status === 200) {
          setSuccessMessage("Request marked as in-progress!");

          // Update the status of the request in local state without needing to reload
          setRequests((prevRequests) =>
            prevRequests.map((request) =>
              request.id === requestId
                ? { ...request, status: "IN_PROGRESS" } // Update the status locally
                : request
            )
          );
        }
      } catch (error) {
        console.error("Error updating request status:", error);
        alert("Failed to update status. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAssignedRequests();
    }
  }, [isLoggedIn, fetchAssignedRequests]); // Include fetchAssignedRequests in dependencies

  return (
    <div className="container mt-4">
      <h2>Driver Dashboard</h2>

      {!isLoggedIn ? (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      ) : (
        <>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No assigned requests at the moment.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Location</th>
                  <th>Waste Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.location}</td>
                    <td>{request.wasteType}</td>
                    <td>{request.status}</td>
                    <td>
                      {request.status === "PENDING" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCompletion(request.id)}
                        >
                          Mark as Completed
                        </button>
                      ) : request.status === "COMPLETED" ? (
                        <button className="btn btn-success" disabled>
                          COMPLETED
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default DriverDashboard;
