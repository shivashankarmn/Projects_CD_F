import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import axios from "axios"; // Import axios for API requests
import Swal from "sweetalert2";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("USER"); // Default value set to "USER"
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate input fields
  const validateForm = (field) => {
    let formErrors = { ...errors };

    // Validate Name (must be 5 characters or more)
    if (field === "name" || !field) {
      if (!name.trim()) {
        formErrors.name = "Name is required";
      } else if (name.length < 4) {
        formErrors.name = "Name must be at least 5 characters";
      } else {
        delete formErrors.name;
      }
    }

    // Validate Email (must contain "@" and ".")
    if (field === "email" || !field) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email.trim()) {
        formErrors.email = "Email is required";
      } else if (!emailRegex.test(email)) {
        formErrors.email = "Enter a valid email (must contain '@' and '.')";
      } else {
        delete formErrors.email;
      }
    }

    // Validate Address (must be 5 characters or more)
    if (field === "address" || !field) {
      if (!address.trim()) {
        formErrors.address = "Address is required";
      } else if (address.length < 5) {
        formErrors.address = "Address must be at least 5 characters";
      } else {
        delete formErrors.address;
      }
    }

    // Validate Password (must be at least 8 characters, with one special character, one number, and one alphabet)
    if (field === "password" || !field) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!password.trim()) {
        formErrors.password = "Password is required";
      } else if (!passwordRegex.test(password)) {
        formErrors.password =
          "Password must be at least 8 characters, include one number, one alphabet, and one special character";
      } else {
        delete formErrors.password;
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // API Call for Register
  const handleRegisterRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_USER}/api/users/register`,
        { name, email, phone, address, password, role },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API URL:", process.env.REACT_APP_API_URL_USER)
      console.log("API Response:", response); // Log the full response for debugging
      if (response.status === 201 && response.data?.id) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Please log in.",
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/login");
      } else {
        alert(response.data?.message || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error Details:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "An error occurred. Please try again.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleRegisterRequest();
    } else {
      alert("Please fix the errors before submitting");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://txn20.org/wp-content/uploads/2021/10/Hauling_2019_02.jpg-scaled.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="d-flex align-items-center justify-content-center vh-100 bg-gradient">
        <div
          className="card shadow-lg p-4 mt-4"
          style={{
            width: "400px",
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 className="text-center text-black">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label text-black">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                value={name}
                onChange={(e) => { setName(e.target.value); validateForm("name"); }}
                required
                placeholder="Enter your name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); validateForm("email"); }}
                required
                placeholder="Enter your email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                value={phone}
                onChange={(e) => { 
                  const phoneValue = e.target.value;
                  setPhone(phoneValue);
                }}
                required
                placeholder="Enter your phone number"
              />
              {phone.length === 10 && !errors.phone && (
                <div className="valid-feedback">Phone number looks good!</div>
              )}
              {phone.length !== 10 && !errors.phone && (
                <div className="invalid-feedback">Phone number must be exactly 10 digits</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Address</label>
              <input
                type="text"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                value={address}
                onChange={(e) => { setAddress(e.target.value); validateForm("address"); }}
                required
                placeholder="Enter your address"
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); validateForm("password"); }}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">User</option>
                <option value="DRIVER">Driver</option>
              </select>
            </div>
            <div className="d-grid">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Please wait..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
