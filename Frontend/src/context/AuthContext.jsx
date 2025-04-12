// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    // Check localStorage for existing session on initial load
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('name');
    if (storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
      setName(storedName);
    }
  }, []);

  const login = (newRole, newName) => {
    setIsLoggedIn(true);
    setRole(newRole);
    setName(newName);
    localStorage.setItem('role', newRole);
    localStorage.setItem('name', newName);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setName(null);
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);