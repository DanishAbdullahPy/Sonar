'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, AdaptiveDpr, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { ToneMappingMode } from 'postprocessing';
import SolarSystem from './SolarSystem';
import SimpleSolarSystem from './SimpleSolarSystem';
import BeautifulStars from './BeautifulStars';

export default function SolarSystemCanvas({ 
  selectedPlanet, 
  onPlanetSelect, 
  timeOffset = 0, 
  timeSpeed = 100, 
  userLocation,
  realTimeData,
  spacecraftData,
  selectedSpacecraft,
  onSpacecraftSelect
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
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
          }}
        >
          <Suspense fallback={
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#0ea5e9" transparent opacity={0.5} />
            </mesh>
          }>
            {/* Performance optimizations */}
            <AdaptiveDpr pixelated />
            <Preload all />
            
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.05} color="#ffffff" />
            <pointLight 
              position={[0, 0, 0]} 
              intensity={3} 
              color="#FDB813"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.5}
              color="#ffffff"
            />
            
            {/* Beautiful Background Stars */}
            <BeautifulStars count={15000} />
            
            {/* Additional Star Layer */}
            <Stars 
              radius={600} 
              depth={100} 
              count={8000} 
              factor={6} 
              saturation={0}
              fade={true}
              speed={0.02}
            />
            
            {/* Enhanced Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              enableDamping={true}
              dampingFactor={0.05}
              minDistance={5}
              maxDistance={500}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
              zoomSpeed={1.2}
              panSpeed={1}
              rotateSpeed={1}
            />
            
            {/* Solar System Components */}
            <SolarSystem 
              selectedPlanet={selectedPlanet}
              onPlanetSelect={onPlanetSelect}
              timeOffset={timeOffset}
              timeSpeed={timeSpeed}
              userLocation={userLocation}
              realTimeData={realTimeData}
              spacecraftData={spacecraftData}
              selectedSpacecraft={selectedSpacecraft}
              onSpacecraftSelect={onSpacecraftSelect}
              showLabels={true}
              showOrbits={true}
            />
            
            {/* Post-processing Effects */}
            <EffectComposer disableNormalPass>
              <Bloom 
                intensity={0.4}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.1}
                height={300}
              />
              <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            </EffectComposer>
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
          <p className="text-sm text-gray-500 mt-2">
            Try refreshing the page or check your browser console for details.
          </p>
        </div>
      </div>
    );
  }
}
