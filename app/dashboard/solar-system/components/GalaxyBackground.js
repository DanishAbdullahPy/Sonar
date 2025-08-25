// Galaxy Background Component
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function GalaxyBackground({ count = 15000 }) {
  const ref = useRef();
  
  // Generate galaxy-like star distribution
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Galaxy parameters
    const galaxyRadius = 800;
    const galaxyArms = 4;
    const armSpread = 0.3;
    const coreRadius = 100;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create spiral galaxy structure
      const radius = Math.pow(Math.random(), 0.5) * galaxyRadius;
      const spinAngle = radius * 0.005;
      const branchAngle = ((i % galaxyArms) / galaxyArms) * Math.PI * 2;
      
      // Add randomness to create realistic galaxy arms
      const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius;
      const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius * 0.1;
      const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius;
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color based on distance from center (core is more yellow/white, arms are more blue)
      const distanceFromCenter = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
      const normalizedDistance = distanceFromCenter / galaxyRadius;
      
      // Core stars (yellow/white)
      if (distanceFromCenter < coreRadius) {
        colors[i3] = 1; // R
        colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
        colors[i3 + 2] = 0.6 + Math.random() * 0.4; // B
      } 
      // Arm stars (blue/white)
      else {
        const intensity = 0.3 + Math.random() * 0.7;
        colors[i3] = intensity * (0.8 + Math.random() * 0.2); // R
        colors[i3 + 1] = intensity * (0.9 + Math.random() * 0.1); // G  
        colors[i3 + 2] = intensity; // B (more blue)
      }
      
      // Size based on distance and randomness
      sizes[i] = (1 - normalizedDistance * 0.5) * (0.5 + Math.random() * 2);
    }
    
    return [positions, colors, sizes];
  }, [count]);

  // Extremely slow galaxy rotation - realistic cosmic speeds
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.00001; // 10x slower
      ref.current.rotation.x += delta * 0.000005; // 10x slower
    }
  });

  return (
    <group ref={ref}>
      <Points positions={positions} colors={colors} sizes={sizes}>
        <PointMaterial
          transparent
          vertexColors
          size={2}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Galaxy core glow */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa44"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer galaxy glow */}
      <mesh>
        <sphereGeometry args={[400, 32, 32]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}