import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnimeInventory() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get('/api/anime');
        setAnimeList(response.data);
      } catch (err) {
        setError('Failed to fetch anime inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, []);

  if (loading) return <p>Loading anime inventory...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Anime Inventory</h2>
      {animeList.length === 0 ? (
        <p>No anime found in your inventory.</p>
      ) : (
        <ul className="space-y-2">
          {animeList.map((anime) => (
            <li key={anime._id} className="border p-3 rounded bg-white shadow">
              <h3 className="font-semibold">{anime.title}</h3>
              <p>Episodes: {anime.episodes}</p>
              <p>Status: {anime.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnimeInventory;
