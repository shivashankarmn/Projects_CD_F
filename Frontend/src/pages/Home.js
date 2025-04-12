import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import image1 from "../assets/recycle.jpg";
import image2 from "../assets/smart-waste-management-solution.png";
import image3 from "../assets/waste-collection.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Home = () => {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const handleProtectedRouteClick = (targetRole, targetPath) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to access this section",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (role !== targetRole) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: `You need to be logged in as ${targetRole} to access this section`,
        confirmButtonText: "OK",
      });
      return;
    }

    navigate(targetPath);
  };

  return (
    <div className="container text-center mt-4">
      {/* Carousel */}
      <Carousel className="mb-4">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="Waste collection in progress"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h5>Keeping the City Clean</h5>
            <p>Efficient waste collection and disposal.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image2}
            alt="Recycling waste materials"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h5>Recycling for a Better Future</h5>
            <p>Segregate waste and promote sustainability.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image3}
            alt="Smart waste management"
            style={{ height: "400px", objectFit: "cover" }}
          />
          <Carousel.Caption>
            <h5>Smart Waste Management</h5>
            <p>Technology-driven waste tracking and removal.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Main Content */}
      <h1 className="display-4 fw-bold text-success">Smart Waste Management</h1>
      <p className="lead">Help keep your city clean by reporting garbage and tracking cleanups.</p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h3>User</h3>
            <p>Report garbage in your area.</p>
            <button 
              onClick={() => handleProtectedRouteClick("USER", "/user")}
              className="btn btn-success"
            >
              Go to User
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h3>Admin</h3>
            <p>Manage requests and assign trucks.</p>
            <button 
              onClick={() => handleProtectedRouteClick("ADMIN", "/admin")}
              className="btn btn-success"
            >
              Go to Admin
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h3>Driver</h3>
            <p>Pick up garbage and update status.</p>
            <button 
              onClick={() => handleProtectedRouteClick("DRIVER", "/driver")}
              className="btn btn-success"
            >
              Go to Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;