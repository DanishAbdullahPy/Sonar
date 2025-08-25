// Satellite Component
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Satellite({ 
  planetPosition = [0, 0, 0], 
  orbitRadius = 2, 
  orbitSpeed = 1, 
  size = 0.05,
  color = "#ffffff",
  name = "Satellite"
}) {
  const satelliteRef = useRef();
  const orbitRef = useRef();

  useFrame((state, delta) => {
    if (orbitRef.current) {
      // Realistic satellite orbital speed - much slower
      const realOrbitSpeed = orbitSpeed * 0.05; // 20x slower for realistic satellite speeds
      orbitRef.current.rotation.y += delta * realOrbitSpeed;
    }
  });

  return (
    <group position={planetPosition}>
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]}>
          {/* Satellite body */}
          <mesh ref={satelliteRef}>
            <boxGeometry args={[size, size * 0.5, size * 1.5]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Solar panels */}
          <mesh position={[-size * 0.7, 0, 0]}>
            <boxGeometry args={[size * 0.1, size * 1.5, size * 2]} />
            <meshStandardMaterial color="#001122" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[size * 0.7, 0, 0]}>
            <boxGeometry args={[size * 0.1, size * 1.5, size * 2]} />
            <meshStandardMaterial color="#001122" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Antenna */}
          <mesh position={[0, size * 0.5, 0]}>
            <cylinderGeometry args={[size * 0.05, size * 0.05, size * 0.8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
          
          {/* Communication dish */}
          <mesh position={[0, size * 0.8, 0]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[size * 0.3, size * 0.1, size * 0.1]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        </group>
      </group>
      
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.01, orbitRadius + 0.01, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}