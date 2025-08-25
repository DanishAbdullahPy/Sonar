// app/dashboard/solar-system/components/OrbitPath.js
import { useMemo } from 'react';
import { BufferGeometry, Vector3 } from 'three';

export default function OrbitPath({ distance, color = "#333333", opacity = 0.3 }) {
  const points = useMemo(() => {
    const curve = [];
    const segments = 128; // Increased for smoother orbits
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * distance * 10;
      const z = Math.sin(angle) * distance * 10;
      curve.push(new Vector3(x, 0, z));
    }
    
    return curve;
  }, [distance]);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        color={color} 
        transparent 
        opacity={opacity}
        linewidth={2}
      />
    </line>
  );
}