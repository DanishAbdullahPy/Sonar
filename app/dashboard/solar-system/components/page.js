// app/dashboard/solar-system/page.js
'use client';
import { useState } from 'react';
import SolarSystemCanvas from './components/SolarSystemCanvas';
import TimeControls from './components/TimeControls';
import PlanetInfo from './components/PlanetInfo';

export default function SolarSystemPage() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [timeSpeed, setTimeSpeed] = useState(100);
  const [timeOffset, setTimeOffset] = useState(0);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <SolarSystemCanvas 
        selectedPlanet={selectedPlanet}
        onPlanetSelect={setSelectedPlanet}
        timeOffset={timeOffset}
        timeSpeed={timeSpeed}
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
    </div>
  );
}