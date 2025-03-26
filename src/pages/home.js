import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
// import backgroundImage from "../images/background.jpg";

// Dummy data for demonstration
const dummySongs = [
  { id: 1, title: "Song 1", artist: "Artist 1", year: "2021", album: "Album 1", artistImage: "https://via.placeholder.com/50" },
  { id: 2, title: "Song 2", artist: "Artist 2", year: "2022", album: "Album 2", artistImage: "https://via.placeholder.com/50" },
];

const Home = ({ userName, userSubscriptions, onLogout }) => {
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

  useEffect(() => {
    // Simulate fetching subscriptions from DynamoDB
    setSubscriptions(userSubscriptions || []);
  }, [userSubscriptions]);

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
    const filteredSongs = dummySongs.filter(song => {
      return (
        (query.title ? song.title.toLowerCase().includes(query.title.toLowerCase()) : true) &&
        (query.year ? song.year.includes(query.year) : true) &&
        (query.artist ? song.artist.toLowerCase().includes(query.artist.toLowerCase()) : true) &&
        (query.album ? song.album.toLowerCase().includes(query.album.toLowerCase()) : true)
      );
    });

    if (filteredSongs.length === 0) {
      setMessage("No result is retrieved. Please query again.");
      setQueryResults([]);
    } else {
      setMessage("");
      setQueryResults(filteredSongs);
    }
  };

  const handleLogout = () => {
    navigate("/"); // Navigate to the homepage ("/") when logout is clicked
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f9", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      
      {/* Header with Username and Logout */}
      <div style={{ width: "100%", maxWidth: "1200px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", backgroundColor: "#fff", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ color: "#333" }}>Welcome, {userName}</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#e60000"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#ff4d4d"}
        >
          Logout
        </button>
      </div>

      {/* Subscription Area */}
      <div style={{ width: "100%", maxWidth: "800px", marginBottom: "30px" }}>
        <h3 style={{ color: "#333", marginBottom: "15px" }}>Your Subscriptions</h3>
        {subscriptions.length === 0 ? (
          <p style={{ textAlign: "center", color: "black", fontWeight:"bold" }}>You have no subscriptions.</p>
        ) : (
          subscriptions.map((song) => (
            <div key={song.id} style={{ 
              backgroundColor: "#fff", 
              borderRadius: "8px", 
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)", 
              marginBottom: "15px", 
              padding: "15px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
              }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={song.artistImage} alt={song.artist} style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "15px" }} />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{song.title} - {song.artist}</p>
                  <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>({song.year}, {song.album})</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(song.id)}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#ff4d4d",
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
      <div style={{ width: "100%", maxWidth: "1000px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", textAlign: "center" }}>
        <h3 style={{ color: "#333", marginBottom: "20px" }}>Search Music</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Title"
            value={query.title}
            onChange={(e) => setQuery({ ...query, title: e.target.value })}
            style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
          />
          <input
            type="text"
            placeholder="Year"
            value={query.year}
            onChange={(e) => setQuery({ ...query, year: e.target.value })}
            style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
          />
          <input
            type="text"
            placeholder="Artist"
            value={query.artist}
            onChange={(e) => setQuery({ ...query, artist: e.target.value })}
            style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
          />
          <input
            type="text"
            placeholder="Album"
            value={query.album}
            onChange={(e) => setQuery({ ...query, album: e.target.value })}
            style={{ padding: "10px", width: "20%", borderRadius: "5px", border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>
        <button
          onClick={handleQuery}
          style={{
            padding: "10px 20px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
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
                    backgroundColor: "#28a745",
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
    </div>
  );
};

export default Home;
