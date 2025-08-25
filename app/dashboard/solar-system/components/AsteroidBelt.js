// Asteroid Belt Component
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh } from 'three';
import * as THREE from 'three';

export default function AsteroidBelt({ count = 2000, innerRadius = 25, outerRadius = 35 }) {
  const meshRef = useRef();
  
  // Generate asteroid positions and properties
  const { positions, rotations, scales } = useMemo(() => {
    const positions = [];
    const rotations = [];
    const scales = [];
    
    for (let i = 0; i < count; i++) {
      // Random position in belt
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const height = (Math.random() - 0.5) * 2; // Slight vertical spread
      
      positions.push([
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ]);
      
      // Random rotation
      rotations.push([
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ]);
      
      // Random scale
      const scale = 0.1 + Math.random() * 0.3;
      scales.push([scale, scale, scale]);
    }
    
    return { positions, rotations, scales };
  }, [count, innerRadius, outerRadius]);

  // Very slow rotation of the entire belt - realistic space speeds
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.001; // 10x slower
    }
  });

  return (
    <group ref={meshRef}>
      {positions.map((position, i) => (
        <mesh
          key={i}
          position={position}
          rotation={rotations[i]}
          scale={scales[i]}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={`hsl(${30 + Math.random() * 30}, 30%, ${20 + Math.random() * 30}%)`}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}