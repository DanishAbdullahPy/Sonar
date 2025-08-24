'use client';
import { useState, useEffect } from 'react';
import SolarSystemCanvas from './components/SolarSystemCanvas';
import TimeControls from './components/TimeControls';
import PlanetInfo from './components/PlanetInfo';
import PlanetaryDashboard from './components/PlanetaryDashboard';
import SkyMap from './components/SkyMap';

export default function SolarSystemPage() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [timeSpeed, setTimeSpeed] = useState(100);
  const [timeOffset, setTimeOffset] = useState(0);
  const [realTimeData, setRealTimeData] = useState(null);
  const [userLocation, setUserLocation] = useState({ latitude: 28.627222, longitude: -80.620833 }); // Default: Kennedy Space Center

  // Get user's location for accurate planetary positions
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
        try {
          const params = new URLSearchParams({
            latitude: userLocation.latitude.toString(),
            longitude: userLocation.longitude.toString()
          });
          
          const response = await fetch(`/api/planets/realtime?${params}`);
          if (response.ok) {
            const data = await response.json();
            setRealTimeData(data);
          } else {
            console.warn('Failed to fetch real-time data, using simulation mode');
            // Set a fallback structure to prevent undefined errors
            setRealTimeData({
              timestamp: new Date().toISOString(),
              location: userLocation,
              planets: {},
              meta: { source: 'simulation' }
            });
          }
        } catch (error) {
          console.error('Error fetching real-time data:', error);
          // Set a fallback structure to prevent undefined errors
          setRealTimeData({
            timestamp: new Date().toISOString(),
            location: userLocation,
            planets: {},
            meta: { source: 'simulation', error: error.message }
          });
        }
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userLocation]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <SolarSystemCanvas 
        selectedPlanet={selectedPlanet}
        onPlanetSelect={setSelectedPlanet}
        timeOffset={timeOffset}
        timeSpeed={timeSpeed}
        realTimeData={realTimeData}
        userLocation={userLocation}
      />
      
      {/* UI Overlays */}
      <TimeControls 
        timeSpeed={timeSpeed}
        onSpeedChange={setTimeSpeed}
        onTimeChange={setTimeOffset}
      />
      
      <PlanetInfo 
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
        realTimeData={realTimeData}
      />
      
      {/* Planetary Dashboard */}
      <PlanetaryDashboard 
        userLocation={userLocation}
        realTimeData={realTimeData}
        onPlanetSelect={setSelectedPlanet}
      />
      
      {/* Sky Map */}
      <SkyMap 
        realTimeData={realTimeData}
        userLocation={userLocation}
        onPlanetSelect={setSelectedPlanet}
      />
      
      {/* Navigation */}
      <div className="absolute top-6 left-6">
        <a 
          href="/dashboard"
          className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/90 transition-colors"
        >
          ← Back to Dashboard
        </a>
      </div>

      {/* Location Info */}
      <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
        📍 {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
      </div>
    </div>
  );
}