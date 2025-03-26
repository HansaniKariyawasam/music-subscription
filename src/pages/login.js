import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../images/background.jpg";
import iconImage from "../images/icon.jpeg";
import musicLtrImage from "../images/music.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials (Replace with real authentication later)
    const validEmail = "test@example.com";
    const validPassword = "password123";

    if (email === validEmail && password === validPassword) {
      navigate("/home"); // Redirect to Home page
    } else {
      setError("Email or password is invalid");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: `url(${backgroundImage}) no-repeat center center fixed`,
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "500px",
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(to bottom, rgba(255, 235, 220, 0.7), rgba(250, 215, 195, 0.7))",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left-side image */}
        <div
          style={{
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={iconImage}
            alt="Symphonia"
            style={{ width: "100%", borderRadius: "5px" }}
          />
        </div>

        {/* Login Form */}
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: `url(${musicLtrImage})`,
            justifyContent: "flex-start",  // Align the children to the top
            padding: "20px",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              fontSize: "30px",
              marginTop: "70px", 
              marginBottom: "70px", 
              background: "linear-gradient(to right, #0A0A33,#008BCC, #E91E63, #F06292)",  // Gradient from left to right
              backgroundClip: "text",  // Standard background-clip for text support
              color: "transparent",
            }}
          >
            Start Listening with Symphonia
          </h3>

          <form
            onSubmit={handleLogin}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "300px",  // Wider input field
                marginBottom: "15px",  // Increased margin between fields
                padding: "10px",  // Increased padding for a better feel
                borderRadius: "8px",  // Rounded corners
                border: "1px solid #ccc",  // Subtle border color
                fontSize: "16px",  // Slightly larger text
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",  // Soft shadow for depth
                transition: "all 0.3s ease",  // Smooth transition for focus effect
              }}
              onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)"}  // Focus effect
              onBlur={(e) => e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"}  // Remove focus effect
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "300px",  // Same as the email input
                marginBottom: "20px",  // Margin for better spacing
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)"}
              onBlur={(e) => e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"}
            />
            <button
              type="submit"
              style={{
                width: "100px",  // Match width with the inputs
                padding: "12px",  // Increase padding for a more comfortable button
                background: "black",
                color: "white",
                cursor: "pointer",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "all 0.3s ease",  // Smooth transition effect for the button
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",  // Adding shadow for depth
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#3c3c3c"}  // Hover effect
              onMouseOut={(e) => e.target.style.backgroundColor = "black"}  // Revert on mouse out
            >
              Login
            </button>
          </form>
          {error && (
            <p style={{ color: "#ba0000", fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>
              {error}
            </p>
          )}
          <p style={{ fontSize: "12px", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
            Don't have an account? <a href="/register" style={{ color: "blue" }}>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
