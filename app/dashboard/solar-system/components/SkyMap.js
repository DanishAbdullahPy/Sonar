'use client';
import { useState, useEffect } from 'react';

export default function SkyMap({ realTimeData, userLocation, onPlanetSelect }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!realTimeData || !realTimeData.planets) {
    return null;
  }

  const planets = Object.entries(realTimeData.planets).map(([key, data]) => ({
    key,
    ...data
  }));

  // Convert altitude/azimuth to x/y coordinates for the sky map
  const convertToSkyCoords = (altitude, azimuth) => {
    // Sky map is a circular projection where:
    // - Center is zenith (90° altitude)
    // - Edge is horizon (0° altitude)
    // - Azimuth determines angle around the circle
    
    const radius = (90 - altitude) / 90; // 0 at zenith, 1 at horizon
    const angle = (azimuth - 90) * (Math.PI / 180); // Convert to radians, adjust for coordinate system
    
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    return { x, y };
  };

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

  const getPlanetSize = (magnitude) => {
    // Brighter objects (lower magnitude) should be larger
    const baseSize = Math.max(8, 20 - magnitude * 3);
    return Math.min(baseSize, 24);
  };

  return (
    <>
      {/* Toggle button - Positioned below navbar */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute top-20 right-4 md:top-24 md:right-6 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg hover:bg-black/90 transition-colors text-sm border border-gray-700 z-40"
      >
        {isVisible ? '🌌 Hide Sky Map' : '🗺️ Show Sky Map'}
      </button>

      {/* Sky Map Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full mx-4 border border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">🌌 Sky Map</h2>
                <p className="text-gray-400 text-sm">
                  Current view from {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Sky Map Container */}
            <div className="relative">
              {/* Sky Map Circle */}
              <div className="relative w-96 h-96 mx-auto">
                {/* Background circle (sky) */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-900/30 to-blue-950/50 border-2 border-gray-600"></div>
                
                {/* Horizon line */}
                <div className="absolute inset-0 rounded-full border-2 border-gray-500"></div>
                
                {/* Cardinal directions */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold">N</div>
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-white text-sm font-bold">E</div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold">S</div>
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-white text-sm font-bold">W</div>
                
                {/* Altitude circles */}
                <div className="absolute inset-8 rounded-full border border-gray-700 opacity-50"></div>
                <div className="absolute inset-16 rounded-full border border-gray-700 opacity-50"></div>
                <div className="absolute inset-24 rounded-full border border-gray-700 opacity-50"></div>
                
                {/* Center point (zenith) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                
                {/* Planets */}
                {planets.map((planet) => {
                  const coords = convertToSkyCoords(planet.altitude, planet.azimuth);
                  const size = getPlanetSize(planet.magnitude);
                  
                  // Convert normalized coordinates to pixel positions
                  const x = (coords.x * 180) + 192; // 192 is half of 384 (container width)
                  const y = (coords.y * 180) + 192;
                  
                  return (
                    <div
                      key={planet.key}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125 ${
                        planet.isVisible ? 'opacity-100' : 'opacity-40'
                      }`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        fontSize: `${size}px`
                      }}
                      onClick={() => onPlanetSelect && onPlanetSelect(planet)}
                      title={`${planet.name} - Alt: ${planet.altitude.toFixed(1)}° Az: ${planet.azimuth.toFixed(1)}° Mag: ${planet.magnitude.toFixed(1)}`}
                    >
                      {getPlanetEmoji(planet.name)}
                      {planet.isVisible && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap">
                          {planet.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-6 text-sm text-gray-300">
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full opacity-100"></div>
                    <span>Above horizon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full opacity-40"></div>
                    <span>Below horizon</span>
                  </div>
                </div>
                <p className="text-center mt-2 text-xs text-gray-400">
                  Click on planets to view details • Larger symbols indicate brighter objects
                </p>
              </div>
            </div>

            {/* Current conditions */}
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Current Conditions</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400">Visible planets:</span>
                  <span className="ml-2 text-green-400 font-medium">
                    {planets.filter(p => p.isVisible).length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Best viewing:</span>
                  <span className="ml-2 text-blue-400 font-medium">
                    {planets
                      .filter(p => p.isVisible && p.altitude > 30)
                      .sort((a, b) => a.magnitude - b.magnitude)[0]?.name || 'None high'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <span className="ml-2 text-gray-300">
                    {new Date(realTimeData.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Data source:</span>
                  <span className="ml-2 text-cyan-400 font-medium">Live API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}