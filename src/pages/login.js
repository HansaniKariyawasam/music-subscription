import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Create the request body
    const requestBody = {
      email,
      password,
    };

    try {
      // Send the login credentials to your backend API
      const response = await fetch("https://3iquyh2c7f.execute-api.us-east-1.amazonaws.com/production/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json(); // Parse the JSON response

      // Check for success or failure
      if (response.ok) {

        localStorage.setItem("userEmail", email);
        navigate("/home");
      } else {
        // If login fails, show error message
        setError(result.message);
      }
    } catch (error) {
      // If there was an error with the request (network issues, etc.)
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Left Column - Image */}
      <div
        style={{
          flex: 1,
          background: `url(https://plus.unsplash.com/premium_photo-1731355235887-9611a0524173?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGVuam95aW5nJTIwbXVzaWN8ZW58MHx8MHx8fDA%3D) center center`,
          backgroundSize: "cover",

        }}
      />


      {/* Right Column - Login Form */}
      <div
        style={{
          flex: 2,
          background: "linear-gradient(to right, rgba(10, 19, 51, 0.9), rgba(0, 139, 204, 0.9), rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.9))",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >



        <div style={{
          width: "60%",
          maxWidth: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
          fontFamily: "'Poppins', sans-serif",
        }}>
          <h3
            style={{
              textAlign: "center",
              fontSize: "40px",
              marginBottom: "30px",
              background: "linear-gradient(to right, #0A0A33,#008BCC, #003366, #003366)",
              backgroundClip: "text",
              color: "transparent",
              marginTop: "4%"
            }}
          >
            Welcome Back, to Symphony
          </h3>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", marginTop: "10%" }}>
            {/* Email Field */}
            <div style={{ position: "relative", width: "100%", maxWidth: "100%", marginBottom: "15px" }}>
              <FaEnvelope
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#888",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 35px", // Padding-left for icon
                  borderRadius: "8px",
                  border: "1px solid #fff", // White border
                  fontSize: "16px",
                  boxSizing: "border-box",
                  boxShadow: "0 2px 6px rgba(255, 255, 255, 0.1)", // White subtle shadow
                  transition: "all 0.3s ease",
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Adjusting background to enhance visibility
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)")}
                onBlur={(e) => (e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)")}
              />
            </div>

            {/* Password Field */}
            <div style={{ position: "relative", width: "100%", maxWidth: "100%", marginBottom: "20px" }}>
              <FaLock
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#888",
                  pointerEvents: "none",
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 35px", // Padding-left for icon
                  borderRadius: "8px",
                  border: "1px solid #fff", // White border
                  fontSize: "16px",
                  boxSizing: "border-box",
                  boxShadow: "0 2px 6px rgba(255, 255, 255, 0.1)", // White subtle shadow
                  transition: "all 0.3s ease",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)")}
                onBlur={(e) => (e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)")}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "10%", marginBottom: "10px" }}>
              <button
                type="submit"
                style={{
                  width: "120px",
                  padding: "12px",
                  background: "linear-gradient(to bottom, #000000 0%, #003366 100%)",

                  color: "white",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#3c3c3c")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "black")}
              >
                Login
              </button>
            </div>

          </form>
          {error && (
            <p style={{ color: "#ba0000", fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>
              {error}
            </p>
          )}
          <p style={{ fontSize: "12px", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>
            Don't have an account? <a href="/register" style={{
              fontSize: "14px",
              background: "linear-gradient(to bottom, #0A0A33,#008BCC, #003366, #003366)",
              backgroundClip: "text",
              color: "transparent",
            }}>Register</a>
          </p>
        </div>
      </div>
    </div>
  );

}

export default Login;
