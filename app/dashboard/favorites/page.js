
'use client';
import { useState, useEffect } from 'react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch favorites
  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/favorites');

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a favorite
  const removeFavorite = async (type, objectId) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, object_id: objectId })
      });

      if (response.ok) {
        // Update the UI by removing the favorite
        setFavorites(prev => prev.filter(fav => !(fav.type === type && fav.object_id === objectId)));
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <main className="relative px-4 pt-24 pb-8 max-w-7xl mx-auto flex flex-col gap-16 overflow-hidden">
      {/* Animated space background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#151b2c] to-[#1a2332]"></div>

        {/* Animated stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                opacity: Math.random() * 0.8 + 0.2,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Nebula effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span className="text-4xl">⭐</span> Your Favorites
        </h1>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-200">
            Error: {error}
          </div>
        )}

        {/* Favorites Grid */}
        {!loading && !error && favorites.length === 0 && (
          <div className="bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="text-5xl mb-4">🌌</div>
            <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
            <p className="text-gray-400">Start saving your favorite astronomy pictures!</p>
            <a 
              href="/dashboard/apod" 
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Browse APODs
            </a>
          </div>
        )}

        {!loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={`${fav.type}-${fav.object_id}`} className="bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {fav.data.media_type === 'image' ? (
                  <div className="aspect-video">
                    <img 
                      src={fav.data.url} 
                      alt={fav.data.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-gray-900/50">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎬</div>
                      <p className="text-gray-400">Video</p>
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white">{fav.data.title}</h3>
                    <button 
                      onClick={() => removeFavorite(fav.type, fav.object_id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove from favorites"
                    >
                      <span className="text-xl">🗑️</span>
                    </button>
                  </div>

                  <p className="text-gray-300 text-sm">{fav.data.date}</p>

                  <p className="text-gray-400 text-sm line-clamp-2">{fav.data.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
