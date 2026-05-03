import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { loginUser } from "../services/auth.services";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      setUser(res.user);
      if (res.user.role === "USER") navigate("/dash");
      else navigate("/admin/*");
    } catch (err) {
      setError(err?.response?.data?.message || "Login Failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-96 border border-gray-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login Page
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-4 border rounded-lg"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 mb-4 border rounded-lg"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </form>

        <p className="text-center text-sm text-gray-700 mt-5">
          Already have an account?{" "}
          <Link className="text-black" to="/">
            register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
