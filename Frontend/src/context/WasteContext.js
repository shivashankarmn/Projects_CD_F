import { createContext, useState } from "react";

export const WasteContext = createContext();

export const WasteProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  const addRequest = (location, description) => {
    const newRequest = {
      id: requests.length + 1,
      location,
      description,
      status: "Pending",
    };
    setRequests([...requests, newRequest]);
  };

  const assignDriver = (id, driverName) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, driver: driverName, status: "Assigned" } : req
      )
    );
  };

  const markCompleted = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: "Completed" } : req
      )
    );
  };

  return (
    <WasteContext.Provider value={{ requests, addRequest, assignDriver, markCompleted }}>
      {children}
    </WasteContext.Provider>
  );
};
