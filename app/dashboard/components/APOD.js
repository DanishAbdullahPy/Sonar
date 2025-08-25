
'use client';

import { useState, useEffect } from 'react';

export default function APODComponent() {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);

  // Function to fetch APOD data
  const fetchAPOD = async (selectedDate = '') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('api_key', 'DEMO_KEY');

      if (selectedDate) {
        params.append('date', selectedDate);
      }

      const response = await fetch(`/api/nasa/apod?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch APOD data');
      }

      const data = await response.json();
      setApodData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to check if APOD is already favorited
  const checkIfFavorite = async () => {
    if (!apodData) return;
    
    setCheckingFavorite(true);
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) return;
      
      const data = await response.json();
      const isFav = data.favorites.some(fav => fav.object_id === apodData.url);
      setIsFavorite(isFav);
    } catch (err) {
      console.error('Error checking favorite status:', err);
    } finally {
      setCheckingFavorite(false);
    }
  };

  // Function to toggle favorite status
  const toggleFavorite = async () => {
    if (!apodData) return;
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'apod',
          object_id: apodData.url,
          label: apodData.title,
          data: apodData
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result.isFavorite || true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Fetch today's APOD on component mount
  useEffect(() => {
    fetchAPOD();
  }, []);

  // Check favorite status when APOD data changes
  useEffect(() => {
    if (apodData) {
      checkIfFavorite();
    }
  }, [apodData]);

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      fetchAPOD(date);
    }
  };

  return (
    <div className="bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">🌠</span> Astronomy Picture of the Day
      </h2>

      {/* Date Selector */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Fetch APOD
        </button>
      </form>

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

      {/* APOD Display */}
      {apodData && !loading && (
        <div className="space-y-6">
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-900/50">
            {apodData.media_type === 'image' ? (
              <img 
                src={apodData.url} 
                alt={apodData.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-gray-400">Video: {apodData.title}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{apodData.title}</h3>
              <div className="flex gap-2 items-center">
                {apodData.copyright && (
                  <p className="text-gray-400 text-sm">© {apodData.copyright}</p>
                )}
                <button 
                  onClick={toggleFavorite}
                  disabled={checkingFavorite}
                  className={`p-2 rounded-full ${isFavorite ? 'text-pink-500 hover:text-pink-400' : 'text-gray-400 hover:text-pink-500'} transition-colors`}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? (
                    <span className="text-xl">❤️</span>
                  ) : (
                    <span className="text-xl">🤍</span>
                  )}
                </button>
              </div>
            </div>

            <p className="text-gray-300">{apodData.date}</p>

            <p className="text-gray-300 leading-relaxed">{apodData.explanation}</p>
          
          {/* Display concept tags if available */}
          {apodData.concepts && apodData.concepts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-2">Concept Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {apodData.concepts.map((concept, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-pink-900/30 text-pink-300 rounded-full text-sm"
                  >
                    #{concept}
                  </span>
                ))}
              </div>
            </div>
          )}

            {apodData.hdurl && (
              <a 
                href={apodData.hdurl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View HD Image
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
