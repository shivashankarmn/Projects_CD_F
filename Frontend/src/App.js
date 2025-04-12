// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WasteProvider } from './context/WasteContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import Home from './pages/Home';
import Login from './auth/Login';
import Register from './auth/Register';
import AddDriverPage from './components/AddDriverPage';
import Drivers from './components/Drivers';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <WasteProvider>
      <AuthProvider>
        <Router>
          <div id="root" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/add-driver" element={<AddDriverPage />} />
                <Route path="/driver-assignment/:requestId" element={<Drivers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <footer className="bg-success text-white text-center py-3 mt-auto">
              <div className="container">
                <p className="mb-0">© 2025 Smart Waste Management. All rights reserved.</p>
                <p className="mb-0">
                  <a href="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</a> |
                  <a href="/terms" className="text-white text-decoration-none ms-2">Terms of Service</a>
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </WasteProvider>
  );
}

export default App;