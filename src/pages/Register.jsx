import React, { useState } from "react";
import { registerUser } from "../services/auth.services";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerUser(name, email, password, role);
      setUser(res);
      console.log(res);
      console.log(res);

      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration Failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-96 border border-gray-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Registration Page
        </h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            {" "}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2  focus:ring-blue-400"
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <Link className="text-purple-400" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
