import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [catData, setCatData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bannedBreeds, setBannedBreeds] = useState([]);
  const API_KEY =
    "live_I8zqbAJ4pl1EqKL59NdYiicKq1uK713OU9ppctIbQZtAWReec8nBIM2xbjgKqQzp";

  const fetchRandomCat = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=${API_KEY}`
      );
      const data = response.data[0];

      if (data.breeds && data.breeds.length > 0) {
        const breedData = data.breeds[0];

        if (!bannedBreeds.includes(breedData.name)) {
          setCatData({
            imageUrl: data.url,
            breed: breedData.name,
            origin: breedData.origin || "Unknown",
            temperament: breedData.temperament || "Unknown",
          });
        } else {
          fetchRandomCat(); // Try again if breed is banned
        }
      } else {
        setError("No breed info available. Try again.");
      }
    } catch (err) {
      setError("Failed to fetch cat data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = (breed) => {
    if (bannedBreeds.includes(breed)) {
      setBannedBreeds(bannedBreeds.filter((b) => b !== breed));
    } else {
      setBannedBreeds([...bannedBreeds, breed]);
    }
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  return (
    <div className="app">
      <h1>Cat Explorer</h1>

      <button onClick={fetchRandomCat} disabled={loading}>
        {loading ? "Loading..." : "Get Random Cat"}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="ban-list">
        <h3>Banned Breeds:</h3>
        {bannedBreeds.length === 0 ? (
          <p>None</p>
        ) : (
          <div>
            {bannedBreeds.map((breed) => (
              <span
                key={breed}
                className="ban-item"
                onClick={() => toggleBan(breed)}
              >
                {breed}
              </span>
            ))}
          </div>
        )}
      </div>

      {catData && (
        <div className="cat-card">
          <img src={catData.imageUrl} alt={catData.breed} />
          <div className="cat-info">
            <h2>
              {catData.breed}
              <button
                onClick={() => toggleBan(catData.breed)}
                className="ban-button"
              >
                {bannedBreeds.includes(catData.breed) ? "Unban" : "Ban"}
              </button>
            </h2>
            <p>
              <strong>Origin:</strong> {catData.origin}
            </p>
            <p>
              <strong>Temperament:</strong> {catData.temperament}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
