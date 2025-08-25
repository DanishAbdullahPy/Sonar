// Simplified Solar System for testing
import { PLANETS } from '@/lib/solarSystemData';
import TestPlanet from './TestPlanet';

export default function SimpleSolarSystem() {
  console.log('PLANETS data:', PLANETS);

  if (!PLANETS || Object.keys(PLANETS).length === 0) {
    console.error('PLANETS data is not available');
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* Basic lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
      
      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
      
      {/* Test planets */}
      {Object.values(PLANETS).map((planet, index) => {
        const distance = planet.distance * 10;
        const angle = (index / Object.keys(PLANETS).length) * Math.PI * 2;
        const position = [
          Math.cos(angle) * distance,
          0,
          Math.sin(angle) * distance
        ];
        
        return (
          <TestPlanet
            key={planet.name}
            planetData={planet}
            position={position}
          />
        );
      })}
    </group>
  );
}