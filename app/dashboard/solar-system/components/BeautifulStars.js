// Beautiful Stars Component
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function BeautifulStars({ count = 15000 }) {
  const ref = useRef();
  
  // Generate beautiful star distribution
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create spherical distribution
      const radius = 400 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Star colors - mostly white with some variation
      const brightness = 0.7 + Math.random() * 0.3;
      const colorVariation = Math.random();
      
      if (colorVariation < 0.7) {
        // White stars (70%)
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness;
      } else if (colorVariation < 0.85) {
        // Blue-white stars (15%)
        colors[i3] = brightness * 0.9;
        colors[i3 + 1] = brightness * 0.95;
        colors[i3 + 2] = brightness;
      } else {
        // Yellow-white stars (15%)
        colors[i3] = brightness;
        colors[i3 + 1] = brightness * 0.95;
        colors[i3 + 2] = brightness * 0.8;
      }
      
      // Star sizes - mostly small with some larger ones
      const sizeRandom = Math.random();
      if (sizeRandom < 0.8) {
        sizes[i] = 1 + Math.random() * 2; // Small stars
      } else if (sizeRandom < 0.95) {
        sizes[i] = 3 + Math.random() * 3; // Medium stars
      } else {
        sizes[i] = 6 + Math.random() * 4; // Large bright stars
      }
    }
    
    return [positions, colors, sizes];
  }, [count]);

  // Very subtle rotation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.0001;
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
          opacity={0.9}
        />
      </Points>
    </group>
  );
}