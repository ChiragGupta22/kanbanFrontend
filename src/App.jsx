import React from "react";
import Board from "./components/Board/Board";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/Admin/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoutes";
import { useEffect } from "react";
import { connectWS } from "./services/ws";
const App = () => {
  useEffect(() => {
    try {
      const socket = connectWS();

      socket.on("connect", () => {
        console.log("Connected:", socket.id);
      });

      socket.on("joinRoom", (msg) => {
        console.log(msg);
      });

      return () => {
        socket.off("connect");
      };
    } catch (err) {
      console.log("Socket error:", err);
    }
  }, []);
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
