// Comet Component
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Comet({ 
  orbitRadius = 80, 
  orbitSpeed = 0.2, 
  cometSize = 0.3,
  tailLength = 15
}) {
  const cometRef = useRef();
  const tailRef = useRef();
  const orbitRef = useRef();

  // Create tail geometry
  const tailGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i < tailLength; i++) {
      const t = i / tailLength;
      points.push(new THREE.Vector3(-t * 5, 0, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [tailLength]);

  useFrame((state, delta) => {
    if (orbitRef.current) {
      // Realistic comet orbital speed - very slow for distant orbits
      const realOrbitSpeed = orbitSpeed * 0.1; // 10x slower
      orbitRef.current.rotation.y += delta * realOrbitSpeed;
    }
    
    if (cometRef.current) {
      // Slow comet tumbling rotation
      cometRef.current.rotation.x += delta * 0.2;
      cometRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={[orbitRadius, 0, 0]}>
        {/* Comet nucleus */}
        <mesh ref={cometRef}>
          <sphereGeometry args={[cometSize, 16, 16]} />
          <meshStandardMaterial 
            color="#ccccaa"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Comet glow */}
        <mesh scale={3}>
          <sphereGeometry args={[cometSize, 8, 8]} />
          <meshBasicMaterial
            color="#aaffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Comet tail */}
        <line ref={tailRef} geometry={tailGeometry}>
          <lineBasicMaterial 
            color="#88aaff" 
            transparent 
            opacity={0.6}
            linewidth={3}
          />
        </line>
        
        {/* Particle tail effect */}
        <mesh position={[-2, 0, 0]} scale={[4, 1, 1]}>
          <sphereGeometry args={[cometSize * 2, 8, 8]} />
          <meshBasicMaterial
            color="#4488ff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}