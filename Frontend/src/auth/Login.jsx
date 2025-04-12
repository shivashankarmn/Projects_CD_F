import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Helper function to validate form fields
  const validateForm = () => {
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both username and password.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password Too Short",
        text: "Password must be at least 6 characters long.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }

    if (!["USER", "ADMIN", "DRIVER"].includes(role)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Role",
        text: "Please select a valid role.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return false;
    }

    return true;
  };

  const handleLoginRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL_USER}/auth/login`,
        { name: username, password, role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("API URL:", process.env.REACT_APP_API_URL_USER)

      // More flexible success check
      if (response.data && response.data.toLowerCase().includes("success")) {
        login(role, username);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome, ${username}!`,
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          // Navigation after Swal closes
          switch(role) {
            case "USER":
              navigate("/user");
              break;
            case "ADMIN":
              navigate("/admin");
              break;
            case "DRIVER":
              navigate("/driver");
              break;
            default:
              navigate("/");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data || "Invalid credentials",
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || error.message || "Login failed",
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleLoginRequest();
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('https://txn20.org/wp-content/uploads/2021/10/Hauling_2019_02.jpg-scaled.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="d-flex align-items-center justify-content-center vh-100 bg-gradient">
        <div
          className="card shadow-lg p-4"
          style={{
            width: "350px",
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 className="text-center text-black">Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-black">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-3 position-relative">
              <label className="form-label text-black">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>
            <div className="mb-3">
              <label className="form-label text-black">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="DRIVER">DRIVER</option>
              </select>
            </div>
            <button type="submit" className="btn btn-light w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="mt-3 text-center text-black">
              Don't have an account?{" "}
              <a href="/register" className="text-warning fw-bold">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
