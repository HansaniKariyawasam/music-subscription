import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaLock } from 'react-icons/fa';

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, username, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setError("");
        setSuccess("Registration successful! You can now login.");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
        setSuccess("");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setSuccess("");
      console.error("Registration error:", error);
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
            Join the Symphony of Streamers
          </h3>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column" }}>
            {/* Email Field with Icon */}
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
                onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)"}
                onBlur={(e) => e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"}
              />
            </div>

            {/* Username Field with Icon */}
            <div style={{ position: "relative", width: "100%", maxWidth: "100%", marginBottom: "20px" }}>
              <FaUser style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#888" }} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)"}
                onBlur={(e) => e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"}
              />
            </div>

            {/* Password Field with Icon */}
            <div style={{ position: "relative", width: "100%", maxWidth: "100%", marginBottom: "20px" }}>
              <FaLock style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#888" }} />
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
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Adjusting background to enhance visibility
                }}
                onFocus={(e) => e.target.style.boxShadow = "0 0 8px rgba(0, 122, 255, 0.6)"}
                onBlur={(e) => e.target.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)"}
              />
            </div>

            {/* Register Button */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "10px", marginBottom: "10px" }}>

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
              >
                Register
              </button>
            </div>

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
            Already have an account? <a href="/" style={{
              fontSize: "14px",
              background: "linear-gradient(to bottom, #0A0A33,#008BCC, #003366, #003366)",
              backgroundClip: "text",
              color: "transparent",
            }}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
