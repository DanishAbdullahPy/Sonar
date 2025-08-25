// Simple test component to verify planets render without texture errors
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function TestPlanet({ planetData, position = [0, 0, 0] }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[planetData.radius || 1, 32, 32]} />
      <meshStandardMaterial 
        color={planetData.color || '#888888'}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}