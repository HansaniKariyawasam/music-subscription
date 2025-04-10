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

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (storedEmail) {
      fetch(`http://localhost:5001/subscriptions/${storedEmail}`)
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
      setLoading(false); // 
    }
  }, []);


  const handleRemove = (songId) => {
    const updatedSubscriptions = subscriptions.filter(song => song.id !== songId);
    setSubscriptions(updatedSubscriptions);
    console.log("Remove song from DynamoDB", songId);
  };

  const handleSubscribe = (song) => {
    setSubscriptions([...subscriptions, song]);
    console.log("Subscribe song to DynamoDB", song);
  };

  const handleQuery = () => {
    //   const filteredSongs = dummySongs.filter(song => {
    //     return (
    //       (query.title ? song.title.toLowerCase().includes(query.title.toLowerCase()) : true) &&
    //       (query.year ? song.year.includes(query.year) : true) &&
    //       (query.artist ? song.artist.toLowerCase().includes(query.artist.toLowerCase()) : true) &&
    //       (query.album ? song.album.toLowerCase().includes(query.album.toLowerCase()) : true)
    //     );
    //   }
    // );

    //   if (filteredSongs.length === 0) {
    //     setMessage("No result is retrieved. Please query again.");
    //     setQueryResults([]);
    //   } else {
    //     setMessage("");
    //     setQueryResults(filteredSongs);
    //   }
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
          <h3 style={{ color: "white", marginBottom: "15px", marginLeft: "9%", fontFamily: "Poppins', sans-serif" }}>
            Your Subscriptions
          </h3>

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
              <div key={song.id} style={{
                background: "linear-gradient(to right, #003366 0%, #669999 99%)",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(255, 255, 255, 0.1)",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "80%",
                textAlign: "center",
                margin: "30px auto",
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={song.image_url} alt={song.artist} style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "15px"
                  }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#fff" }}>
                      {song.title} - {song.artist}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#ff7" }}>
                      ({song.year}, {song.album})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(song.id)}
                  style={{
                    padding: "8px 15px",
                    background: "linear-gradient(to bottom, #000000 0%, #003366 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#e60000"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#ff4d4d"}
                >
                  Remove
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
          <button
            onClick={handleQuery}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(to bottom, #000000 0%, #003366 100%)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "20px",
              transition: "background-color 0.3s ease",
              alignSelf: "flex-start", // Align with the input fields
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
          >
            Search Songs
          </button>
          {message && <p style={{ color: "#e60000", marginTop: "20px" }}>{message}</p>}
          {queryResults.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              {queryResults.map((song) => (
                <div key={song.id} style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "15px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={song.artistImage} alt={song.artist} style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "15px" }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>{song.title} - {song.artist}</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>({song.year}, {song.album})</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubscribe(song)}
                    style={{
                      padding: "8px 15px",
                      background: "linear-gradient(to bottom, #000000 0%, #003366 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div></div>
  );
};

export default Home;
