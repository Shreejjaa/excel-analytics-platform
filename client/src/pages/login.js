import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Response from server:", data); // ✅ Debugging

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error); // ✅ Debugging
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Welcome Back 👋</h2>
        <p style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
          Sign in to access your dashboard
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div
          className="forgot-password"
          style={{
            marginTop: "10px",
            fontSize: "14px",
            textAlign: "right",
            color: "#5b9bd5",
            cursor: "pointer",
          }}
          onClick={() =>
            alert(
              "If you forgot your password, please contact the admin or support team for assistance."
            )
          }
        >
          Forgot Password?
        </div>

        <div className="register-link">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
