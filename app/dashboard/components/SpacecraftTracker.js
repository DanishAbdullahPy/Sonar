
'use client';
import { useState, useEffect, useRef } from 'react';

// Mock satellite data for demonstration
const mockSatellites = [
  { id: 'iss', name: 'International Space Station', description: ' habitable artificial satellite in low Earth orbit' },
  { id: 'hst', name: 'Hubble Space Telescope', description: ' space telescope that was launched into low Earth orbit' },
  { id: 'goes16', name: 'GOES-16', description: 'weather satellite operated by NOAA' },
  { id: 'telesat', name: 'Telesat', description: ' Canadian communications satellite' }
];

export default function SpacecraftTracker() {
  const [selectedSatellite, setSelectedSatellite] = useState('iss');
  const [satelliteData, setSatelliteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [groundTrack, setGroundTrack] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to fetch satellite data from the SSC API
  const fetchSatelliteData = async (satId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ssc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          satelliteId: satId,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          resolutionFactor: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch satellite data');
      }

      const data = await response.json();

      // Process the API response
      const processedData = {
        id: data.id,
        name: data.name,
        isMock: data.isMock || false,
        position: {
          latitude: data.positions && data.positions.length > 0 
            ? data.positions[0].coordinates.latitude 
            : (Math.random() * 180 - 90).toFixed(4),
          longitude: data.positions && data.positions.length > 0 
            ? data.positions[0].coordinates.longitude 
            : (Math.random() * 360 - 180).toFixed(4),
          altitude: data.positions && data.positions.length > 0 
            ? data.positions[0].coordinates.altitude 
            : (Math.random() * 500 + 200).toFixed(1)
        },
        velocity: data.positions && data.positions.length > 1 
          ? calculateVelocity(data.positions[0], data.positions[1])
          : (Math.random() * 2 + 7).toFixed(2),
        footprint: (Math.random() * 2000 + 1000).toFixed(0),
        nextPass: {
          startTime: new Date(Date.now() + Math.random() * 3600000).toISOString(),
          endTime: new Date(Date.now() + Math.random() * 3600000 + 1800000).toISOString(),
          maxElevation: (Math.random() * 60 + 10).toFixed(1)
        },
        positions: data.positions || []
      };

      setSatelliteData(processedData);

      // Show warning if using mock data
      if (data.isMock) {
        setError(`Using simulated data. ${data.error || 'Real satellite data unavailable.'}`);
      }
    } catch (err) {
      setError('Failed to fetch satellite data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate velocity between two positions
  const calculateVelocity = (pos1, pos2) => {
    const timeDiff = (new Date(pos2.time) - new Date(pos1.time)) / 1000; // in seconds
    if (timeDiff <= 0) return 0;

    const dx = pos2.position.x - pos1.position.x;
    const dy = pos2.position.y - pos1.position.y;
    const dz = pos2.position.z - pos1.position.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const velocity = distance / timeDiff; // km/s

    return velocity.toFixed(2);
  };

  // Function to draw the Earth
  const drawEarth = (ctx, centerX, centerY, radius, groundTrack = []) => {
    // Draw Earth
    const gradient = ctx.createRadialGradient(
      centerX - radius/3, centerY - radius/3, radius/10,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, '#1e40af');
    gradient.addColorStop(1, '#0c4a6e');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw some continents (simplified)
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(centerX - radius/3, centerY - radius/4, radius/4, radius/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(centerX + radius/4, centerY + radius/5, radius/3, radius/4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw ground track if available
    if (groundTrack.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < groundTrack.length; i++) {
        const point = groundTrack[i];
        const x = centerX + (point.lon / 180) * radius;
        const y = centerY - (point.lat / 90) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Draw atmosphere
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(135, 206, 250, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  // Function to draw orbit
  const drawOrbit = (ctx, centerX, centerY, radius, inclination = 0) => {
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.9, inclination, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Function to draw satellite
  const drawSatellite = (ctx, x, y) => {
    // Draw satellite body
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 4, y - 2, 8, 4);
    
    // Draw solar panels
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(x - 12, y - 1, 6, 2);
    ctx.fillRect(x + 6, y - 1, 6, 2);
    
    // Draw signal
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();
  };

  // Function to animate the satellite
  const animateSatellite = () => {
    const canvas = canvasRef.current;
    if (!canvas || !satelliteData) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const earthRadius = 60;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Earth
    drawEarth(ctx, centerX, centerY, earthRadius, groundTrack);
    
    // Draw orbit
    const orbitRadius = earthRadius + 80;
    drawOrbit(ctx, centerX, centerY, orbitRadius);
    
    // Calculate satellite position
    const time = isAnimationPaused ? animationRef.current.pauseTime : Date.now() / 1000;
    const angle = time * 0.5; // Adjust speed of orbit
    const satelliteX = centerX + Math.cos(angle) * orbitRadius;
    const satelliteY = centerY + Math.sin(angle) * orbitRadius * 0.9;
    
    // Calculate real-world coordinates (simplified)
    const lat = parseFloat((90 - (satelliteY / canvas.height) * 180).toFixed(2));
    const lon = parseFloat(((satelliteX / canvas.width) * 360 - 180).toFixed(2));
    
    // Update satellite data with real-time position
    if (satelliteData) {
      setSatelliteData({
        ...satelliteData,
        position: {
          ...satelliteData.position,
          latitude: lat,
          longitude: lon
        }
      });
    }
    
    // Update ground track
    setGroundTrack(prev => {
      // Add current position to track
      const newTrack = [...prev, { lat, lon }];
      
      // Keep only the last 50 points to avoid performance issues
      return newTrack.slice(-50);
    });
    
    // Draw satellite
    drawSatellite(ctx, satelliteX, satelliteY);
    
    // Draw position indicator
    ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.font = '12px Arial';
    ctx.fillText(`${lat}°, ${lon}°`, satelliteX + 15, satelliteY - 10);
    
    // Draw satellite path
    ctx.beginPath();
    for (let i = 0; i < 20; i++) {
      const pastTime = time - i * 0.1;
      const pastAngle = pastTime * 0.5;
      const pastX = centerX + Math.cos(pastAngle) * orbitRadius;
      const pastY = centerY + Math.sin(pastAngle) * orbitRadius * 0.9;
      
      if (i === 0) {
        ctx.moveTo(pastX, pastY);
      } else {
        ctx.lineTo(pastX, pastY);
      }
    }
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Continue animation only if not paused
    if (!isAnimationPaused) {
      animationRef.current = requestAnimationFrame(animateSatellite);
    }
  };

  // Start animation when satellite data is available
  useEffect(() => {
    if (satelliteData && canvasRef.current) {
      // Start animation
      animateSatellite();
      
      // Clean up animation on unmount or when satellite changes
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [satelliteData]);

  // Function to toggle animation
  const toggleAnimation = () => {
    if (isAnimationPaused) {
      // Resume animation
      setIsAnimationPaused(false);
      animationRef.current.pauseTime = Date.now() / 1000;
      animateSatellite();
    } else {
      // Pause animation
      setIsAnimationPaused(true);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  // Function to clear ground track
  const clearGroundTrack = () => {
    setGroundTrack([]);
  };

  // Fetch data when satellite selection changes
  useEffect(() => {
    if (selectedSatellite) {
      fetchSatelliteData(selectedSatellite);
    }
  }, [selectedSatellite]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-[#151b2c]/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-3xl">🛰️</span> Spacecraft Tracker
      </h2>

      {/* Satellite Selector */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Select Satellite:</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {mockSatellites.map((sat) => (
            <button
              key={sat.id}
              onClick={() => setSelectedSatellite(sat.id)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedSatellite === sat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {sat.name}
            </button>
          ))}
        </div>
      </div>

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

      {/* Satellite Data Display */}
      {!loading && !error && satelliteData && (
        <div className="space-y-6">
          {/* Current Time */}
          <div className="text-center py-2 px-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-sm">Current Time</p>
            <p className="text-white font-mono">{currentTime.toLocaleString()}</p>
          </div>

          {/* Satellite Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">{satelliteData.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-white">{satelliteData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Velocity:</span>
                  <span className="text-white">{satelliteData.velocity} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Footprint:</span>
                  <span className="text-white">{satelliteData.footprint} km</span>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Current Position</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Latitude:</span>
                  <span className="text-white">{satelliteData.position.latitude}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longitude:</span>
                  <span className="text-white">{satelliteData.position.longitude}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Altitude:</span>
                  <span className="text-white">{satelliteData.position.altitude} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Pass */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-2">Next Pass</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Start:</span>
                <span className="text-white">{formatDate(satelliteData.nextPass.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">End:</span>
                <span className="text-white">{formatDate(satelliteData.nextPass.endTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Elevation:</span>
                <span className="text-white">{satelliteData.nextPass.maxElevation}°</span>
              </div>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="bg-gray-900/50 rounded-lg p-4 h-64 flex items-center justify-center relative overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={256}
              className="w-full h-full"
            />
            
            {/* Legend */}
            <div className="absolute bottom-2 left-2 text-xs text-gray-400 flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Earth</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-300 rounded"></div>
                <span>Satellite</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-300"></div>
                <span>Orbit</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-blue-500"></div>
                <span>Path</span>
              </div>
            </div>
            
            {/* Animation Controls */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button 
                onClick={toggleAnimation}
                className="p-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-full transition-colors"
                aria-label={isAnimationPaused ? "Resume animation" : "Pause animation"}
              >
                {isAnimationPaused ? (
                  <span className="text-xl">▶️</span>
                ) : (
                  <span className="text-xl">⏸️</span>
                )}
              </button>
              
              <button 
                onClick={clearGroundTrack}
                className="p-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-full transition-colors"
                aria-label="Clear ground track"
              >
                <span className="text-xl">🧹</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
