import React, { useState, useEffect } from "react";
import {
 BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import FormLogin from "./components/FormLogin";
import FormUser from "./components/FormUser";
import ListEmployee from "./components/ListEmployee";
import FormEmployee from "./components/FormEmployee";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token",token);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  console.log("isAuthenticated",isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormLogin onLogin={setIsAuthenticated} />} />
        <Route path="/register" element={<FormUser />} />
        <Route
          path="/employees"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ListEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-employee"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FormEmployee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-employee/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FormEmployee />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
