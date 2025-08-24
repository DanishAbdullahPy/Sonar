'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import SolarSystem from './SolarSystem';

export default function SolarSystemCanvas({ 
  selectedPlanet, 
  onPlanetSelect, 
  timeOffset = 0, 
  timeSpeed = 100, 
  userLocation,
  realTimeData 
}) {
  // Add validation for required props
  if (typeof timeOffset !== 'number') {
    console.warn('timeOffset is not a number:', timeOffset);
  }
  if (typeof timeSpeed !== 'number') {
    console.warn('timeSpeed is not a number:', timeSpeed);
  }
  try {
    return (
      <div className="w-full h-screen bg-black">
        <Canvas
          camera={{ 
            position: [0, 20, 30], 
            fov: 60 
          }}
          gl={{ 
            antialias: true,
            alpha: true 
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
          }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.1} />
            <pointLight position={[0, 0, 0]} intensity={2} />
            
            {/* Background */}
            <Stars 
              radius={300} 
              depth={60} 
              count={20000} 
              factor={7} 
              saturation={0} 
            />
            
            {/* Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={200}
            />
            
            {/* Solar System Components */}
            <SolarSystem 
              selectedPlanet={selectedPlanet}
              onPlanetSelect={onPlanetSelect}
              timeOffset={timeOffset}
              timeSpeed={timeSpeed}
              userLocation={userLocation}
              realTimeData={realTimeData}
            />
          </Suspense>
        </Canvas>
      </div>
    );
  } catch (error) {
    console.error('SolarSystemCanvas error:', error);
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl mb-2">Solar System Unavailable</h2>
          <p className="text-gray-400">There was an error loading the 3D solar system.</p>
        </div>
      </div>
    );
  }
}