import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user info for profile section
        localStorage.setItem("user", JSON.stringify({ username, email }));
        // Optionally, store token if your backend returns it on register
        // localStorage.setItem("token", data.token);
        alert("✅ Registration successful! You are now logged in.");
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
      console.error("Register error:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Welcome Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-pink-600 to-purple-500 text-white">
        <h1 className="text-4xl font-bold mb-4">Join Excel Analytics</h1>
        <p className="mb-8 text-lg">Start analyzing your Excel data today!</p>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="underline text-white font-semibold">
            Login here
          </Link>
        </p>
      </div>
      {/* Right: Register Form */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg transition-colors duration-500 w-full max-w-md mx-auto flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">Register</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-blue-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-blue-50"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-blue-50"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
