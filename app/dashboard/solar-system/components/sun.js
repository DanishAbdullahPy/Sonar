import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Sun() {
  const sunRef = useRef();
  
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial 
        color="#FDB813"
        emissive="#FDB813"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}