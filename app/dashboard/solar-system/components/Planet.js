// app/dashboard/solar-system/components/Planet.js
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { calculatePlanetPosition, calculateRotation, getPlanetVisibility } from '@/lib/orbitalMechanics';

export default function Planet({ planetData, timeOffset, onPlanetClick, realTimeData }) {
  const planetRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Early return if planetData is not available
  if (!planetData) {
    console.warn('Planet component received undefined planetData');
    return null;
  }
  
  // Get real-time visibility data
  const visibility = getPlanetVisibility(planetData, realTimeData);
  const isVisible = visibility?.isVisible ?? true;
  
  useFrame(() => {
    if (planetRef.current && planetData) {
      try {
        // Update orbital position (now uses real-time data when available)
        const position = calculatePlanetPosition(planetData, timeOffset, realTimeData);
        if (position && typeof position.x === 'number' && typeof position.y === 'number' && typeof position.z === 'number') {
          planetRef.current.position.set(position.x, position.y, position.z);
        }
        
        // Update rotation
        const rotation = calculateRotation(planetData, timeOffset);
        if (typeof rotation === 'number' && !isNaN(rotation)) {
          planetRef.current.rotation.y = rotation;
        }
      } catch (error) {
        console.error('Error updating planet position/rotation:', error, 'Planet:', planetData?.name);
      }
    }
  });

  return (
    <group>
      <mesh
        ref={planetRef}
        onClick={() => onPlanetClick({ ...planetData, visibility, realTimeData })}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? (planetData.radius || 1) * 1.2 : (planetData.radius || 1)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={planetData.color}
          roughness={0.8}
          metalness={0.1}
          opacity={isVisible ? 1.0 : 0.5}
          transparent={!isVisible}
        />
        
        {/* Glow effect when hovered */}
        {hovered && (
          <mesh scale={1.1}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial 
              color={planetData.color}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
        
        {/* Real-time data indicator */}
        {realTimeData && realTimeData.planets && realTimeData.planets[planetData.apiName] && (
          <mesh position={[0, (planetData.radius || 1) + 0.5, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial 
              color={isVisible ? "#00ff00" : "#ff6600"} 
              transparent 
              opacity={0.8}
            />
          </mesh>
        )}
      </mesh>
      
      {/* Visibility indicator ring */}
      {!isVisible && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[(planetData.radius || 1) * 1.5, (planetData.radius || 1) * 1.7, 32]} />
          <meshBasicMaterial color="#ff6600" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}