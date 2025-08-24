'use client';
import { useState, useEffect } from 'react';
import { PLANETS } from '@/lib/solarSystemData';

export default function PlanetaryDashboard({ userLocation, realTimeData, onPlanetSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('altitude'); // altitude, magnitude, name

  if (!realTimeData || !realTimeData.planets) {
    return (
      <div className="absolute bottom-6 right-6 bg-black/90 backdrop-blur-sm rounded-xl p-4 text-white border border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Loading planetary data...</span>
        </div>
      </div>
    );
  }

  const planets = Object.entries(realTimeData.planets).map(([key, data]) => ({
    key,
    ...data
  }));

  // Sort planets based on selected criteria
  const sortedPlanets = [...planets].sort((a, b) => {
    switch (sortBy) {
      case 'altitude':
        return b.altitude - a.altitude;
      case 'magnitude':
        return a.magnitude - b.magnitude; // Brighter objects have lower magnitude
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const visiblePlanets = sortedPlanets.filter(p => p.isVisible);
  const hiddenPlanets = sortedPlanets.filter(p => !p.isVisible);

  // Function to merge API data with static planet data
  const mergePlanetData = (apiPlanet) => {
    const planetName = apiPlanet.name.toLowerCase();
    const staticPlanet = Object.values(PLANETS).find(p => p.apiName === planetName);
    
    if (staticPlanet) {
      return {
        ...staticPlanet,
        ...apiPlanet,
        visibility: {
          isVisible: apiPlanet.isVisible,
          altitude: apiPlanet.altitude,
          azimuth: apiPlanet.azimuth,
          magnitude: apiPlanet.magnitude,
          constellation: apiPlanet.constellation
        }
      };
    }
    
    // Fallback if no static data found
    return {
      ...apiPlanet,
      moons: [],
      mass: 'Unknown',
      distance: 'Unknown',
      orbitalPeriod: 'Unknown',
      rotationPeriod: 'Unknown'
    };
  };

  return (
    <div className={`absolute bottom-6 right-6 bg-black/90 backdrop-blur-sm rounded-xl text-white border border-gray-700 transition-all duration-300 ${
      isExpanded ? 'w-96 max-h-96 overflow-y-auto' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">🌌 Sky Tonight</h3>
            <p className="text-xs text-gray-400">
              📍 {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? '▼' : '▲'}
          </button>
        </div>
        
        {/* Quick stats */}
        <div className="flex gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{visiblePlanets.length} visible</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>{hiddenPlanets.length} below horizon</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Sort controls */}
          <div className="p-3 border-b border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('altitude')}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === 'altitude' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Height
              </button>
              <button
                onClick={() => setSortBy('magnitude')}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === 'magnitude' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Brightness
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === 'name' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Name
              </button>
            </div>
          </div>

          {/* Visible planets */}
          {visiblePlanets.length > 0 && (
            <div className="p-3">
              <h4 className="text-sm font-semibold text-green-400 mb-2">✨ Currently Visible</h4>
              <div className="space-y-2">
                {visiblePlanets.map((planet) => (
                  <PlanetCard 
                    key={planet.key} 
                    planet={planet} 
                    onSelect={(p) => onPlanetSelect && onPlanetSelect(mergePlanetData(p))}
                    isVisible={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hidden planets */}
          {hiddenPlanets.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-orange-400 mb-2">🌅 Below Horizon</h4>
              <div className="space-y-2">
                {hiddenPlanets.map((planet) => (
                  <PlanetCard 
                    key={planet.key} 
                    planet={planet} 
                    onSelect={(p) => onPlanetSelect && onPlanetSelect(mergePlanetData(p))}
                    isVisible={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Data timestamp */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Updated: {new Date(realTimeData.timestamp).toLocaleTimeString()}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanetCard({ planet, onSelect, isVisible }) {
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
    if (!isVisible) return 'Below horizon';
    if (altitude > 60) return 'High in sky';
    if (altitude > 30) return 'Mid-sky';
    if (altitude > 10) return 'Low on horizon';
    return 'Very low';
  };

  const getBrightnessDescription = (magnitude) => {
    if (magnitude < -2) return 'Very bright';
    if (magnitude < 0) return 'Bright';
    if (magnitude < 2) return 'Moderate';
    if (magnitude < 4) return 'Dim';
    return 'Very dim';
  };

  return (
    <div 
      className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
        isVisible 
          ? 'bg-green-900/20 border-green-700 hover:bg-green-900/30' 
          : 'bg-orange-900/20 border-orange-700 hover:bg-orange-900/30'
      }`}
      onClick={() => onSelect && onSelect(planet)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getPlanetEmoji(planet.name)}</span>
          <div>
            <div className="font-medium text-sm">{planet.name}</div>
            <div className="text-xs text-gray-400">
              {getVisibilityDescription(planet.altitude, planet.magnitude)}
            </div>
          </div>
        </div>
        
        <div className="text-right text-xs">
          {isVisible && (
            <>
              <div className="text-gray-300">{planet.altitude.toFixed(1)}°</div>
              <div className="text-gray-400">mag {planet.magnitude.toFixed(1)}</div>
            </>
          )}
          {!isVisible && (
            <div className="text-gray-400">Hidden</div>
          )}
        </div>
      </div>
      
      {isVisible && planet.constellation && (
        <div className="mt-1 text-xs text-gray-500">
          in {planet.constellation}
        </div>
      )}
    </div>
  );
}