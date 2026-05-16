import React from "react";
import Board from "./components/Board/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/Admin/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />

        <Route
          path="/dash"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <Board />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard allowedRoles={["ADMIN", "MANAGER"]} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
