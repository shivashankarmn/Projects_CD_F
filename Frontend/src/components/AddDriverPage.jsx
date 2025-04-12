import React, { useState } from "react";
import axios from "axios";

const AddDriverPage = () => {
  const [driverName, setDriverName] = useState(""); // Manually entered driver name
  const [vehicleNumber, setVehicleNumber] = useState(""); // Manually entered vehicle number
  const [availabilityStatus, setAvailabilityStatus] = useState("AVAILABLE"); // Default availability
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const data = {
        name: driverName, // Use manually entered name
        vehicleNumber, // Use manually entered vehicle number
        availabilityStatus,
      };

      const response = await axios.post("${process.env.REACT_APP_API_URL_USER}/api/drivers", data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa("admin:admin123")}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage("Driver added successfully!");
        setDriverName(""); // Reset form fields
        setVehicleNumber("");
        setAvailabilityStatus("AVAILABLE");
      }
    } catch (error) {
      console.error("Error adding driver:", error);
  
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Failed to add the driver"}`);
      } else if (error.request) {
        alert("Error: No response received from the server. Please check your network.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Driver</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="driverName" className="form-label">Driver Name</label>
          <input
            type="text"
            id="driverName"
            className="form-control"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)} // Manually update driver name
            required
            placeholder="Enter driver name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="vehicleNumber" className="form-label">Vehicle Number</label>
          <input
            type="text"
            id="vehicleNumber"
            className="form-control"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)} // Manually update vehicle number
            required
            placeholder="Enter vehicle number"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="availabilityStatus" className="form-label">Availability Status</label>
          <select
            id="availabilityStatus"
            className="form-select"
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value)} // Update availability status
            required
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="NOT AVAILABLE">NOT AVAILABLE</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding Driver..." : "Add Driver"}
        </button>
      </form>

      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
    </div>
  );
};

export default AddDriverPage;
