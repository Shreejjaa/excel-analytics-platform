import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Handle Google OAuth success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        alert("✅ Google login successful!");
        navigate("/dashboard");
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Error processing Google login");
      }
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Login successful!");
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-800 to-blue-400 text-white items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="mb-8">Access your analytics dashboard securely.</p>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="underline text-cyan-200">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 bg-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">Login</h2>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition mb-4"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-center mt-4 text-gray-600">
            Forgot your password? Contact the admin team.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
