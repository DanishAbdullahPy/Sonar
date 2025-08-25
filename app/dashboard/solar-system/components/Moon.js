// Moon Component
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Moon({ 
  planetPosition = [0, 0, 0], 
  orbitRadius = 3, 
  orbitSpeed = 2, 
  size = 0.27,
  color = "#c0c0c0"
}) {
  const moonRef = useRef();
  const orbitRef = useRef();

  useFrame((state, delta) => {
    if (orbitRef.current) {
      // Realistic moon orbital speed - much slower
      const realOrbitSpeed = orbitSpeed * 0.01; // 100x slower
      orbitRef.current.rotation.y += delta * realOrbitSpeed;
    }
    
    if (moonRef.current) {
      // Moon rotation (tidally locked, very slow)
      moonRef.current.rotation.y += delta * orbitSpeed * 0.001;
    }
  });

  return (
    <group position={planetPosition}>
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]}>
          <mesh ref={moonRef} castShadow receiveShadow>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial 
              color={color}
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
          
          {/* Moon glow */}
          <mesh scale={1.1}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.05}
            />
          </mesh>
        </group>
      </group>
      
      {/* Moon orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial color="#888888" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}