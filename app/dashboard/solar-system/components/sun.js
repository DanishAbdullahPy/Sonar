import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import PlanetTexture from './PlanetTexture';

// Sun data for consistency with planet system
const SUN_DATA = {
  name: "Sun",
  texture: "/textures/planets/sun/albedo.svg",
  color: "#FDB813"
};

export default function Sun() {
  const sunRef = useRef();
  
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05; // Slower rotation for the sun
    }
  });

  return (
    <group>
      {/* Main Sun */}
      <mesh ref={sunRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 64, 32]} />
        <PlanetTexture 
          planetData={SUN_DATA}
          fallbackColor="#FDB813"
          isEmissive={true}
        />
      </mesh>
      
      {/* Sun Corona/Glow */}
      <mesh position={[0, 0, 0]} scale={2.2}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial 
          color="#FFA500"
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}