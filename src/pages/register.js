import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../images/background.jpg";
import musicLtrImage from "../images/music.png";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Simulating the login table as an array of objects
  const users = [
    { email: "test@example.com", username: "testuser", password: "password123" },
  ];

  const handleRegister = (e) => {
    e.preventDefault();

    // Check if the email already exists
    const existingUser = users.find((user) => user.email === email);
    
    if (existingUser) {
      // If email exists, show error
      setError("The email already exists");
      setSuccess(""); // Clear success message
    } else {
      // If email is unique, add new user and show success
      users.push({ email, username, password });
      setError(""); // Clear error message
      setSuccess("Registration successful! You can now login.");
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
          width: "500px",
          height: "500px",
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(to bottom, rgba(255, 235, 220, 0.7), rgba(250, 215, 195, 0.7))",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >

        {/* Register Form */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",  // Align the children to the top
            alignItems: "center",
            padding: "20px",
            background: `url(${musicLtrImage})`,
          }}
        >
          <h3
            style={{
              textAlign: "center",
              fontSize: "30px",
              background: "linear-gradient(to right, #0A0A33,#00aeff, #E91E63, #F06292)",  // Gradient from left to right
              backgroundClip: "text",  // Standard background-clip for text support
              color: "transparent",
              marginBottom: "70px",
            }}
          >
            Register with Symphonia
          </h3>

          <form
            onSubmit={handleRegister}
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
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                width: "300px",  
                marginBottom: "30px",  // Increased margin between fields
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
            <button
              type="submit"
              style={{
                width: "100px",
                padding: "10px",
                background: "black",
                color: "white",
                cursor: "pointer",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Register
            </button>
          </form>

          {error && (
            <p style={{ color: "#ba0000", fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>
              {error}
            </p>
          )}

          {success && (
            <p style={{ color: "green", fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>
              {success}
            </p>
          )}

          <p style={{ fontSize: "12px", textAlign: "center", marginTop: "12px", fontWeight: "bold" }}>
            Already have an account? <a href="/" style={{ color: "blue" }}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
