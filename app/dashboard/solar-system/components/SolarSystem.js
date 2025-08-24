// app/dashboard/solar-system/components/SolarSystem.js
import { PLANETS } from '@/lib/solarSystemData';
import Sun from '../components/sun';
import Planet from './Planet';
import OrbitPath from './OrbitPath';

export default function SolarSystem({ 
  selectedPlanet, 
  onPlanetSelect, 
  timeOffset = 0, 
  timeSpeed = 100, 
  userLocation,
  realTimeData 
}) {
  // Validate PLANETS data
  if (!PLANETS || Object.keys(PLANETS).length === 0) {
    console.error('PLANETS data is not available');
    return null;
  }
  return (
    <group>
      {/* Sun */}
      <Sun />
      
      {/* Real-time data indicator */}
      {realTimeData && (
        <mesh position={[0, -5, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      )}
      
      {/* Orbital Paths */}
      {Object.values(PLANETS).map(planet => (
        <OrbitPath 
          key={`orbit-${planet.name}`}
          distance={planet.distance}
          color="#444444"
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
            onPlanetClick={onPlanetSelect}
            realTimeData={realTimeData}
          />
        );
      })}
    </group>
  );
}