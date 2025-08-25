'use client';
import { useState, useEffect } from 'react';
import SolarSystemCanvas from './components/SolarSystemCanvas';
import TimeControls from './components/TimeControls';
import PlanetInfo from './components/PlanetInfo';
import PlanetaryDashboard from './components/PlanetaryDashboard';
import SkyMap from './components/SkyMap';
import { PLANETS } from '@/lib/solarSystemData';
import './components/PlanetLabels.css';

export default function SolarSystemPage() {
  const [selectedPlanetName, setSelectedPlanetName] = useState(null);
  const [timeSpeed, setTimeSpeed] = useState(100); // Start with 100x speed for visible motion
  const [timeOffset, setTimeOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [userLocation, setUserLocation] = useState({ latitude: 28.627222, longitude: -80.620833 }); // Default: Kennedy Space Center
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [locationStatus, setLocationStatus] = useState('requesting'); // 'requesting', 'granted', 'denied'

  // Get the selected planet object from the name
  const selectedPlanet = selectedPlanetName ? Object.values(PLANETS).find(p => p.name === selectedPlanetName) : null;

  // Get user's location for accurate planetary positions
  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        try {
          setLocationStatus('requesting');
          
          // Request location with high accuracy
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
              }
            );
          });
          
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          setLocationStatus('granted');
          console.log('Location obtained:', position.coords.latitude, position.coords.longitude);
        } catch (error) {
          console.warn('Location access denied or failed:', error.message);
          setLocationStatus('denied');
          // Keep default location (Kennedy Space Center)
        }
      } else {
        console.warn('Geolocation not supported by this browser');
        setLocationStatus('denied');
      }
    };

    getLocation();
  }, []);

  // Function to request location permission
  const requestLocation = () => {
    if (navigator.geolocation) {
      setLocationStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationStatus('granted');
        },
        (error) => {
          console.warn('Location access denied:', error.message);
          setLocationStatus('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  };

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
        selectedPlanet={selectedPlanetName}
        onPlanetSelect={setSelectedPlanetName}
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
        onClose={() => setSelectedPlanetName(null)}
        realTimeData={realTimeData}
      />
      
      {/* Mobile-friendly Dashboard - Hidden on small screens */}
      <div className="hidden lg:block">
        <PlanetaryDashboard 
          userLocation={userLocation}
          realTimeData={realTimeData}
          onPlanetSelect={setSelectedPlanetName}
        />
      </div>
      
      {/* Mobile-friendly Sky Map - Hidden on small screens */}
      <div className="hidden lg:block">
        <SkyMap 
          realTimeData={realTimeData}
          userLocation={userLocation}
          onPlanetSelect={setSelectedPlanetName}
        />
      </div>
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          {/* Navigation */}
          <a 
            href="/dashboard"
            className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-black/90 transition-colors text-sm md:text-base"
          >
            ← Back to Dashboard
          </a>

          {/* Location Info */}
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm">
            📍 {userLocation.latitude.toFixed(1)}°, {userLocation.longitude.toFixed(1)}°
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden absolute bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/90 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Location Permission Notification */}
      {locationStatus === 'denied' && (
        <div className="absolute top-24 left-4 right-4 md:left-6 md:right-6 bg-orange-900/90 backdrop-blur-sm text-white p-4 rounded-lg z-40 max-w-md">
          <div className="flex items-start gap-3">
            <div className="text-orange-400 mt-0.5">📍</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium mb-1">Enable Location for Sky View</h4>
              <p className="text-xs text-orange-200 mb-3">
                Allow location access to see real-time planetary positions from your location.
              </p>
              <button 
                onClick={requestLocation}
                className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-xs transition-colors"
              >
                Enable Location
              </button>
            </div>
            <button 
              onClick={() => setLocationStatus('dismissed')}
              className="text-orange-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-black/95 rounded-xl p-6 m-4 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">Space Dashboard</h3>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="text-white hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 text-white">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Sky Tonight</h4>
                <p className="text-xs text-gray-400">
                  {locationStatus === 'granted' && realTimeData ? 
                    'Real-time planetary positions for your location' : 
                    locationStatus === 'denied' ? 
                    'Using default location (Kennedy Space Center)' :
                    'Loading sky data...'
                  }
                </p>
                {locationStatus === 'denied' && (
                  <button 
                    onClick={requestLocation}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs transition-colors"
                  >
                    Enable Location
                  </button>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Controls</h4>
                <p className="text-xs text-gray-400">
                  • Drag to rotate view<br/>
                  • Scroll to zoom<br/>
                  • Click planets to select<br/>
                  • Use time controls to speed up
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}