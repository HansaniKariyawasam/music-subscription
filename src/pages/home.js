import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Home = ({ userSubscriptions, onLogout }) => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [subscriptions, setSubscriptions] = useState(userSubscriptions || []);
  const [query, setQuery] = useState({
    title: "",
    year: "",
    artist: "",
    album: "",
  });
  const [queryResults, setQueryResults] = useState([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [removeMessage, setRemoveMessage] = useState("");
  const [removingSongId, setRemovingSongId] = useState(null);
  const [subscribingSongId, setSubscribingSongId] = useState(null);
  const [searching, setSearching] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedUserName) {
      const storedUserName = localStorage.getItem("user_name");
      setUserName(storedUserName);
    }

    if (storedEmail) {
      fetch(`https://3iquyh2c7f.execute-api.us-east-1.amazonaws.com/production/subscriptions?email=${storedEmail}`)
        .then((response) => response.json())
        .then((data) => {
          setSubscriptions(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch subscriptions:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);


  const handleRemove = async (songid, songTitle) => {
    const email = localStorage.getItem("userEmail");
    setRemovingSongId(songid);
  
    const payload = {
      body: JSON.stringify({
        email,
        songid
      }),
    };
    
    try {
      const response = await fetch("https://3iquyh2c7f.execute-api.us-east-1.amazonaws.com/production/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
      console.log("Lambda response:", responseData);
  
      if (response.ok) {
        setSubscriptions(prev => prev.filter(song => song.id !== songid));
        setRemoveMessage(`"${songTitle}" removed from your subscriptions`);
      } else {
        alert("Failed to unsubscribe.");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      alert("An error occurred while unsubscribing.");
    } finally {
      setRemovingSongId(null);
      setTimeout(() => setRemoveMessage(""), 3000);
    }
  };


  const handleSubscribe = async (song) => {
    const email = localStorage.getItem("userEmail");
    setSubscribingSongId(song.id);
  
    const payload = {
      body: JSON.stringify({
        email,
        song: { id: song.id }
      }),
    };
    
    try {
      const response = await fetch("https://3iquyh2c7f.execute-api.us-east-1.amazonaws.com/production/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        setSubscriptions((prev) => [...prev, song]);
        setSubscribeMessage(`You subscribed to: "${song.title}"`);
      } else {
        alert("Failed to subscribe.");
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      alert("An error occurred while subscribing.");
    } finally {
      setSubscribingSongId(null);
      setTimeout(() => setSubscribeMessage(""), 3000);
    }
  };
  


  const handleQuery = async () => {
    if (!query.title && !query.year && !query.artist && !query.album) {
      setMessage("Please fill in at least one field to search.");
      setQueryResults([]);
      return;
    }
    setSearching(true);
  
    try {
      const params = new URLSearchParams();
      if (query.title) params.append("title", query.title);
      if (query.year) params.append("year", query.year);
      if (query.artist) params.append("artist", query.artist);
      if (query.album) params.append("album", query.album);
  
      const response = await fetch(`https://3iquyh2c7f.execute-api.us-east-1.amazonaws.com/production/query?${params.toString()}`);
  
      const data = await response.json();
  
      if (data.length === 0) {
        setMessage("No result is retrieved. Please query again.");
        setQueryResults([]);
      } else {
        setMessage(""); 
        setQueryResults(data);
      }
    } catch (error) {
      console.error("Error fetching query results:", error);
      setMessage("Something went wrong. Please try again later.");
      setQueryResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearQuery = () => {
    setQuery({ title: "", year: "", artist: "", album: "" });
    setQueryResults([]);
    setMessage("");
  };

  const handleLogout = () => {
    navigate("/"); // Navigate to the homepage ("/") when logout is clicked
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        margin: 0,
        padding: 0,
        background: "linear-gradient(to right, rgba(10, 19, 51, 0.9), rgba(0, 139, 204, 0.9), rgba(0, 51, 102, 0.8), rgba(0, 51, 102, 0.9))",
      }}

    >
      <div
        style={{
          position: "relative",
          zIndex: 2,

        }}
      >
        {/* Header with Username and Logout */}
        <div style={{
          padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "linear-gradient(to bottom, #000000 0%, #003366 78%)"
        }}>
          <h2 style={{ color: "#fff", marginLeft: "3%", }}>
            Welcome back, {userName || "Guest"}
          </h2>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fff",
              color: "#333",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#fff"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
          >
            Logout
          </button>
        </div>

        {/* Subscription Area */}
        <div style={{ marginTop: "3%" }}>
          <h3 style={{ color: "white", marginBottom: "15px", marginLeft: "9%", }}>
            Your Subscriptions
          </h3>

          {removeMessage && (
            <div
              className="alert alert-dismissible fade show"
              role="alert"
              style={{
                position: "fixed",
                top: "80px",
                right: "20px",
                zIndex: 1050,
                backgroundColor: "white",
                color: "#333",
                border: "1px solid #ccc",
                padding: "15px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                minWidth: "250px",
                maxWidth: "400px",
                fontWeight: "500",
                fontFamily: "Poppins', sans-serif",
                fontSize: "14px",
                gap: "10px",
                display: "flex",
              }}
            >
              <strong>{removeMessage}</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setRemoveMessage("")}
              ></button>
            </div>
          )}

          {subscribeMessage && (
            <div
              className="alert alert-dismissible fade show"
              role="alert"
              style={{
                position: "fixed",
                top: "140px",
                right: "20px",
                zIndex: 1050,
                backgroundColor: "white",
                color: "#333",
                border: "1px solid #ccc",
                padding: "15px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                minWidth: "250px",
                maxWidth: "400px",
                fontWeight: "500",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <strong>{subscribeMessage}</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={() => setSubscribeMessage("")}
              ></button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ color: "white", fontWeight: "bold", marginTop: "10px" }}>
                Loading your subscriptions...
              </p>
            </div>

          ) : subscriptions.length === 0 ? (
            <p style={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              marginBottom: "3%",
              fontSize: "14px"
            }}>
              You have no subscriptions.
            </p>
          ) : (
            subscriptions.map((song) => (
              <div
                key={song.id}
                style={{
                  background: "linear-gradient(to right, #002244 0%, #005f73 100%)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "80%",
                  maxWidth: "800px",
                  margin: "24px auto",
                  color: "#fff",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                {/* Song Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <img
                    src={song.image_base64}
                    alt={song.artist}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      objectFit: "cover",
                      boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)"
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>
                      {song.title} — {song.artist}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#ddf" }}>
                      ({song.year} • {song.album})
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(song.id, song.title)}
                  disabled={removingSongId === song.id}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(to right, #8B0000, #B22222)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minWidth: "100px",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                  }}

                >
                  {removingSongId === song.id ? (
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                      style={{ width: "1rem", height: "1rem" }}
                    >
                      <span className="visually-hidden">Removing...</span>
                    </div>
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>

            ))
          )}
        </div>

        {/* Query Area */}
        <div style={{ marginTop: "5%", width: "80%", backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", boxShadow: "0px 4px 15px rgba(0,0,0,0.2)", textAlign: "center", margin: "0 auto", padding: "20px", marginBottom: "7%" }}>
          <h3 style={{
            background: "linear-gradient(to right, #0A0A33,#008BCC, #003366, #003366)",
            backgroundClip: "text",
            color: "transparent", fontSize: "24px"
          }}>Search Music</h3>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", }}>
            <input
              type="text"
              placeholder="Title"
              value={query.title}
              onChange={(e) => setQuery({ ...query, title: e.target.value })}
              style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #fff", fontSize: "14px" }}
            />
            <input
              type="text"
              placeholder="Year"
              value={query.year}
              onChange={(e) => setQuery({ ...query, year: e.target.value })}
              style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #fff", fontSize: "14px" }}
            />
            <input
              type="text"
              placeholder="Artist"
              value={query.artist}
              onChange={(e) => setQuery({ ...query, artist: e.target.value })}
              style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #fff", fontSize: "14px" }}
            />
            <input
              type="text"
              placeholder="Album"
              value={query.album}
              onChange={(e) => setQuery({ ...query, album: e.target.value })}
              style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #fff", fontSize: "14px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
            {/* Search Songs Button */}
            <button
              onClick={handleQuery}
              disabled={searching}
              style={{
                padding: "10px 24px",
                background: "linear-gradient(to bottom, #000000 0%, #003366 100%)",
                color: "white",
                border: "none",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: searching ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              {searching && (
                <div className="spinner-border spinner-border-sm text-light" role="status" style={{ width: "1rem", height: "1rem" }}>
                  <span className="visually-hidden">Searching...</span>
                </div>
              )}
              {searching ? "Searching..." : "Search Songs"}
            </button>

            {/* Clear Search Button */}
            <button
              onClick={clearQuery}
              className="btn btn-outline-light"
              style={{
                padding: "10px 20px",
                borderRadius: "30px",
                fontSize: "14px",
                fontWeight: "500",
                border: "2px solid #fff",
                background: "linear-gradient(to right, #0A0A33,#008BCC, #003366, #003366)",
                backgroundClip: "text",
                color: "transparent",
                transition: "all 0.3s ease",
              }}
            >
              Clear Search
            </button>
          </div>


          {message && <p style={{ color: "#e60000", marginTop: "20px" }}>{message}</p>}
          {queryResults.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              {queryResults.map((song) => {
                const isAlreadySubscribed = subscriptions.some((s) => s.id === song.id);

                return (
                  <div key={song.id} style={{
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    padding: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <img
                        src={song.image_url}
                        alt={song.artist}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          objectFit: "cover"
                        }}
                      />
                      <div style={{ textAlign: "left", lineHeight: "1.4" }}>
                        <p style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#003366",
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          {song.title} — {song.artist}
                        </p>
                        <p style={{
                          margin: 0,
                          fontSize: "13px",
                          color: "#555",
                          fontStyle: "italic"
                        }}>
                          ({song.year} • {song.album})
                        </p>
                      </div>
                    </div>


                    {isAlreadySubscribed ? (
                      <button
                        disabled
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "#aaa",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "14px"
                        }}
                      >
                        Subscribed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(song)}
                        disabled={subscribingSongId === song.id}
                        style={{
                          padding: "8px 15px",
                          background: "linear-gradient(to bottom, #000000 0%, #003366 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px"
                        }}
                      >
                        {subscribingSongId === song.id ? (
                          <div className="spinner-border spinner-border-sm text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          "Subscribe"
                        )}
                      </button>
                    )}
                  </div>
                );
              })}

            </div>
          )}
        </div>
      </div></div>
  );
};

export default Home;
