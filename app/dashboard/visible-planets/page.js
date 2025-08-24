'use client';
import { useState, useEffect } from 'react';

export default function VisiblePlanetsPage() {
  const [realTimeData, setRealTimeData] = useState(null);
  const [userLocation, setUserLocation] = useState({ latitude: 28.627222, longitude: -80.620833 });
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [sortBy, setSortBy] = useState('altitude');

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
  }, []);

  // Fetch real-time planetary data
  useEffect(() => {
    const fetchData = async () => {
      if (userLocation) {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            latitude: userLocation.latitude.toString(),
            longitude: userLocation.longitude.toString(),
            showCoords: 'true',
            aboveHorizon: 'false'
          });
          
          if (selectedTime) {
            params.append('time', selectedTime);
          }
          
          const response = await fetch(`/api/planets/realtime?${params}`);
          if (response.ok) {
            const data = await response.json();
            setRealTimeData(data);
          }
        } catch (error) {
          console.error('Error fetching real-time data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes if using current time
    if (!selectedTime) {
      const interval = setInterval(fetchData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userLocation, selectedTime]);

  const planets = realTimeData?.planets ? Object.entries(realTimeData.planets).map(([key, data]) => ({
    key,
    ...data
  })) : [];

  // Sort planets
  const sortedPlanets = [...planets].sort((a, b) => {
    switch (sortBy) {
      case 'altitude':
        return b.altitude - a.altitude;
      case 'magnitude':
        return a.magnitude - b.magnitude;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'azimuth':
        return a.azimuth - b.azimuth;
      default:
        return 0;
    }
  });

  const visiblePlanets = sortedPlanets.filter(p => p.isVisible);
  const hiddenPlanets = sortedPlanets.filter(p => !p.isVisible);

  const getPlanetEmoji = (name) => {
    const emojis = {
      mercury: '☿️',
      venus: '♀️',
      earth: '🌍',
      mars: '♂️',
      jupiter: '♃',
      saturn: '♄',
      uranus: '♅',
      neptune: '♆'
    };
    return emojis[name.toLowerCase()] || '🪐';
  };

  const formatCoordinates = (coords) => {
    if (!coords) return 'N/A';
    const { hours, minutes, seconds, negative } = coords;
    const sign = negative ? '-' : '';
    return `${sign}${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
  };

  const formatDeclination = (coords) => {
    if (!coords) return 'N/A';
    const { degrees, arcminutes, arcseconds, negative } = coords;
    const sign = negative ? '-' : '+';
    return `${sign}${degrees}° ${arcminutes}' ${arcseconds.toFixed(1)}"`;
  };

  const getVisibilityDescription = (altitude, magnitude) => {
    if (altitude < 0) return 'Below horizon';
    if (altitude > 60) return 'High in sky - Excellent viewing';
    if (altitude > 30) return 'Mid-sky - Good viewing';
    if (altitude > 10) return 'Low on horizon - Fair viewing';
    return 'Very low - Difficult viewing';
  };

  const getBrightnessDescription = (magnitude) => {
    if (magnitude < -2) return 'Very bright - Easily visible';
    if (magnitude < 0) return 'Bright - Clearly visible';
    if (magnitude < 2) return 'Moderate - Visible to naked eye';
    if (magnitude < 4) return 'Dim - May need binoculars';
    return 'Very dim - Telescope required';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#151b2c] to-[#1a2332] text-white">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌌 Visible Planets</h1>
              <p className="text-gray-400">
                Real-time planetary positions from your location
              </p>
            </div>
            <a 
              href="/dashboard"
              className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>

          {/* Location and time controls */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <div className="text-white">
                  📍 {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Time</label>
                <input
                  type="datetime-local"
                  value={selectedTime || ''}
                  onChange={(e) => setSelectedTime(e.target.value || null)}
                  className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data Updated</label>
                <div className="text-white text-sm">
                  {realTimeData ? new Date(realTimeData.timestamp).toLocaleString() : 'Loading...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-400">Loading planetary data...</p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('altitude')}
                  className={`px-3 py-1 text-sm rounded ${
                    sortBy === 'altitude' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Sort by Height
                </button>
                <button
                  onClick={() => setSortBy('magnitude')}
                  className={`px-3 py-1 text-sm rounded ${
                    sortBy === 'magnitude' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Sort by Brightness
                </button>
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-3 py-1 text-sm rounded ${
                    sortBy === 'name' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Sort by Name
                </button>
              </div>
              
              <button
                onClick={() => setShowCoordinates(!showCoordinates)}
                className={`px-3 py-1 text-sm rounded ${
                  showCoordinates ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {showCoordinates ? 'Hide' : 'Show'} Coordinates
              </button>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{visiblePlanets.length}</div>
                <div className="text-sm text-gray-400">Visible Planets</div>
              </div>
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400">{hiddenPlanets.length}</div>
                <div className="text-sm text-gray-400">Below Horizon</div>
              </div>
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {visiblePlanets.filter(p => p.altitude > 30).length}
                </div>
                <div className="text-sm text-gray-400">High in Sky</div>
              </div>
              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {visiblePlanets.filter(p => p.magnitude < 2).length}
                </div>
                <div className="text-sm text-gray-400">Bright Objects</div>
              </div>
            </div>

            {/* Visible planets */}
            {visiblePlanets.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-green-400">�� Currently Visible</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {visiblePlanets.map((planet) => (
                    <PlanetCard 
                      key={planet.key} 
                      planet={planet} 
                      showCoordinates={showCoordinates}
                      isVisible={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hidden planets */}
            {hiddenPlanets.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-orange-400">🌅 Below Horizon</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {hiddenPlanets.map((planet) => (
                    <PlanetCard 
                      key={planet.key} 
                      planet={planet} 
                      showCoordinates={showCoordinates}
                      isVisible={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PlanetCard({ planet, showCoordinates, isVisible }) {
  const getPlanetEmoji = (name) => {
    const emojis = {
      mercury: '☿️',
      venus: '♀️',
      earth: '🌍',
      mars: '♂️',
      jupiter: '♃',
      saturn: '♄',
      uranus: '♅',
      neptune: '♆'
    };
    return emojis[name.toLowerCase()] || '🪐';
  };

  const getVisibilityDescription = (altitude, magnitude) => {
    if (altitude < 0) return 'Below horizon';
    if (altitude > 60) return 'High in sky - Excellent viewing';
    if (altitude > 30) return 'Mid-sky - Good viewing';
    if (altitude > 10) return 'Low on horizon - Fair viewing';
    return 'Very low - Difficult viewing';
  };

  const getBrightnessDescription = (magnitude) => {
    if (magnitude < -2) return 'Very bright - Easily visible';
    if (magnitude < 0) return 'Bright - Clearly visible';
    if (magnitude < 2) return 'Moderate - Visible to naked eye';
    if (magnitude < 4) return 'Dim - May need binoculars';
    return 'Very dim - Telescope required';
  };

  const formatCoordinates = (coords) => {
    if (!coords) return 'N/A';
    const { hours, minutes, seconds, negative } = coords;
    const sign = negative ? '-' : '';
    return `${sign}${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
  };

  const formatDeclination = (coords) => {
    if (!coords) return 'N/A';
    const { degrees, arcminutes, arcseconds, negative } = coords;
    const sign = negative ? '-' : '+';
    return `${sign}${degrees}° ${arcminutes}' ${arcseconds.toFixed(1)}"`;
  };

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:scale-105 ${
      isVisible 
        ? 'bg-green-900/20 border-green-700 hover:bg-green-900/30' 
        : 'bg-orange-900/20 border-orange-700 hover:bg-orange-900/30'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getPlanetEmoji(planet.name)}</span>
          <div>
            <h3 className="text-xl font-bold">{planet.name}</h3>
            <p className="text-sm text-gray-400">
              {getVisibilityDescription(planet.altitude, planet.magnitude)}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isVisible ? 'bg-green-600' : 'bg-orange-600'
        }`}>
          {isVisible ? 'VISIBLE' : 'HIDDEN'}
        </div>
      </div>

      {/* Main data */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400">Altitude</div>
          <div className="text-lg font-medium">{planet.altitude.toFixed(1)}°</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Azimuth</div>
          <div className="text-lg font-medium">{planet.azimuth.toFixed(1)}°</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Magnitude</div>
          <div className="text-lg font-medium">{planet.magnitude.toFixed(1)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Constellation</div>
          <div className="text-lg font-medium">{planet.constellation || 'N/A'}</div>
        </div>
      </div>

      {/* Brightness description */}
      <div className="mb-4 p-3 bg-black/30 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Brightness</div>
        <div className="text-sm">{getBrightnessDescription(planet.magnitude)}</div>
      </div>

      {/* Coordinates (if enabled) */}
      {showCoordinates && planet.coordinates && (
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400 mb-2">Celestial Coordinates</div>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Right Ascension:</span>
              <span className="ml-2 font-mono">{formatCoordinates(planet.coordinates.rightAscension)}</span>
            </div>
            <div>
              <span className="text-gray-400">Declination:</span>
              <span className="ml-2 font-mono">{formatDeclination(planet.coordinates.declination)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}