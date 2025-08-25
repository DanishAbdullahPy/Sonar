// Nebula Effect Component
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Nebula({ position = [150, 50, -200], scale = 80 }) {
  const nebulaRef = useRef();
  
  // Create nebula geometry with multiple layers
  const nebulaGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 32, 32);
  }, []);

  useFrame((state, delta) => {
    if (nebulaRef.current) {
      // Very slow rotation - cosmic speeds
      nebulaRef.current.rotation.y += delta * 0.001;
      nebulaRef.current.rotation.x += delta * 0.0005;
      
      // Gentle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 + 1;
      nebulaRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <group position={position}>
      {/* Main nebula cloud */}
      <mesh ref={nebulaRef} geometry={nebulaGeometry}>
        <meshBasicMaterial
          color="#ff4488"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Secondary layer */}
      <mesh geometry={nebulaGeometry} scale={scale * 0.7}>
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh geometry={nebulaGeometry} scale={scale * 0.4}>
        <meshBasicMaterial
          color="#ffaa44"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}