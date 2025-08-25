// app/dashboard/solar-system/components/SolarSystem.js
import { PLANETS } from '@/lib/solarSystemData';
import Sun from '../components/sun';
import Planet from './Planet';
import OrbitPath from './OrbitPath';
import AsteroidBelt from './AsteroidBelt';
import Comet from './Comet';
import SpacecraftTracker from './SpacecraftTracker';

export default function SolarSystem({ 
  selectedPlanet, 
  onPlanetSelect, 
  timeOffset = 0, 
  timeSpeed = 1, 
  userLocation,
  realTimeData,
  spacecraftData,
  selectedSpacecraft,
  onSpacecraftSelect,
  showLabels = true,
  showOrbits = true
}) {
  // Validate PLANETS data
  if (!PLANETS || Object.keys(PLANETS).length === 0) {
    console.error('PLANETS data is not available');
    return null;
  }

  return (
    <group>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight 
        position={[0, 0, 0]} 
        intensity={2} 
        color="#FDB813"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-near={0.1}
      />
      
      {/* Sun */}
      <Sun />
      
      {/* Real-time data indicator */}
      {realTimeData && (
        <group position={[0, -8, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>
          <mesh position={[0, -1, 0]}>
            <boxGeometry args={[2, 0.5, 0.1]} />
            <meshBasicMaterial color="#001100" />
          </mesh>
        </group>
      )}
      
      {/* Orbital Paths */}
      {showOrbits && Object.values(PLANETS).map(planet => (
        <OrbitPath 
          key={`orbit-${planet.name}`}
          distance={planet.distance}
          color={selectedPlanet === planet.name ? "#00ff00" : "#444444"}
          opacity={selectedPlanet === planet.name ? 0.8 : 0.3}
        />
      ))}
      
      {/* Planets */}
      {Object.values(PLANETS).map(planet => {
        // Validate planet data before rendering
        if (!planet || !planet.name || typeof planet.radius !== 'number' || typeof planet.distance !== 'number') {
          console.warn('Invalid planet data:', planet);
          return null;
        }
        
        return (
          <Planet
            key={planet.name}
            planetData={planet}
            timeOffset={timeOffset}
            timeSpeed={timeSpeed}
            onPlanetClick={onPlanetSelect}
            realTimeData={realTimeData}
            showLabels={showLabels}
            selectedPlanet={selectedPlanet}
          />
        );
      })}
      
      {/* Spacecraft Tracking */}
      {spacecraftData && (
        <SpacecraftTracker
          spacecraftData={spacecraftData}
          onSpacecraftSelect={onSpacecraftSelect}
          selectedSpacecraft={selectedSpacecraft}
          showLabels={showLabels}
        />
      )}
      
      {/* Asteroid Belt (between Mars and Jupiter only) */}
      <AsteroidBelt 
        count={600} 
        innerRadius={15.2} 
        outerRadius={25} 
      />
      
      {/* Clean Space Background */}
      <mesh>
        <sphereGeometry args={[800, 32, 32]} />
        <meshBasicMaterial 
          color="#000008" 
          side={1} // BackSide
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
}