// Spacecraft 3D Component
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function Spacecraft({ 
  spacecraftData, 
  onSpacecraftClick, 
  showLabels = true,
  selectedSpacecraft 
}) {
  const spacecraftRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  if (!spacecraftData || !spacecraftData.position) {
    return null;
  }
  
  // Convert Earth radii to scene units (Earth radius ≈ 6.371 km)
  const earthRadius = 6.371;
  const scenePosition = [
    spacecraftData.position.x / earthRadius,
    spacecraftData.position.y / earthRadius,
    spacecraftData.position.z / earthRadius
  ];
  
  // Gentle rotation animation
  useFrame((state, delta) => {
    if (spacecraftRef.current) {
      spacecraftRef.current.rotation.y += delta * 0.5;
      spacecraftRef.current.rotation.x += delta * 0.2;
    }
  });
  
  const isSelected = selectedSpacecraft === spacecraftData.id;
  const scale = isSelected ? 1.5 : 1;
  
  // Get spacecraft appearance based on type
  const getSpacecraftAppearance = (type) => {
    switch (type) {
      case 'station':
        return { color: '#ffffff', emissive: '#0066ff', size: 0.3 };
      case 'telescope':
        return { color: '#ffaa00', emissive: '#ff6600', size: 0.25 };
      case 'science':
        return { color: '#00ff88', emissive: '#00aa44', size: 0.2 };
      case 'solar':
        return { color: '#ffff00', emissive: '#ffaa00', size: 0.25 };
      case 'deep_space':
        return { color: '#aa88ff', emissive: '#6644aa', size: 0.15 };
      default:
        return { color: '#cccccc', emissive: '#666666', size: 0.2 };
    }
  };
  
  const appearance = getSpacecraftAppearance(spacecraftData.type);
  
  // Get spacecraft emoji for labels
  const getSpacecraftEmoji = (type, id) => {
    if (id === 'iss') return '🛰️';
    if (id.includes('hubble')) return '🔭';
    if (id.includes('voyager')) return '🚀';
    if (type === 'telescope') return '🔭';
    if (type === 'station') return '🛰️';
    if (type === 'solar') return '☀️';
    if (type === 'deep_space') return '🚀';
    return '📡';
  };
  
  return (
    <group position={scenePosition}>
      {/* Main spacecraft body */}
      <mesh
        ref={spacecraftRef}
        onClick={() => onSpacecraftClick?.(spacecraftData)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={[scale, scale, scale]}
      >
        <boxGeometry args={[appearance.size, appearance.size * 0.6, appearance.size * 1.2]} />
        <meshStandardMaterial
          color={appearance.color}
          emissive={isSelected ? appearance.emissive : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Solar panels (for satellites) */}
      {spacecraftData.type !== 'deep_space' && (
        <>
          <mesh position={[-appearance.size * 0.8, 0, 0]} scale={[scale, scale, scale]}>
            <boxGeometry args={[appearance.size * 0.1, appearance.size * 1.5, appearance.size * 2]} />
            <meshStandardMaterial
              color="#001144"
              metalness={0.9}
              roughness={0.1}
              emissive={isSelected ? '#002288' : '#000000'}
              emissiveIntensity={isSelected ? 0.2 : 0}
            />
          </mesh>
          <mesh position={[appearance.size * 0.8, 0, 0]} scale={[scale, scale, scale]}>
            <boxGeometry args={[appearance.size * 0.1, appearance.size * 1.5, appearance.size * 2]} />
            <meshStandardMaterial
              color="#001144"
              metalness={0.9}
              roughness={0.1}
              emissive={isSelected ? '#002288' : '#000000'}
              emissiveIntensity={isSelected ? 0.2 : 0}
            />
          </mesh>
        </>
      )}
      
      {/* Communication dish */}
      <mesh position={[0, appearance.size * 0.4, 0]} rotation={[Math.PI / 6, 0, 0]} scale={[scale, scale, scale]}>
        <cylinderGeometry args={[appearance.size * 0.3, appearance.size * 0.1, appearance.size * 0.1]} />
        <meshStandardMaterial
          color="#cccccc"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, appearance.size * 0.6, 0]} scale={[scale, scale, scale]}>
        <cylinderGeometry args={[appearance.size * 0.02, appearance.size * 0.02, appearance.size * 0.8]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      
      {/* Orbital trail */}
      {spacecraftData.type !== 'deep_space' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[
            Math.sqrt(scenePosition[0]**2 + scenePosition[2]**2) - 0.02,
            Math.sqrt(scenePosition[0]**2 + scenePosition[2]**2) + 0.02,
            32
          ]} />
          <meshBasicMaterial
            color={appearance.color}
            transparent
            opacity={isSelected ? 0.4 : 0.1}
          />
        </mesh>
      )}
      
      {/* Spacecraft glow effect */}
      <mesh scale={[scale * 2, scale * 2, scale * 2]}>
        <sphereGeometry args={[appearance.size, 8, 8]} />
        <meshBasicMaterial
          color={appearance.emissive}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <ringGeometry args={[appearance.size * 2, appearance.size * 2.3, 32]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Spacecraft Label */}
      {showLabels && (
        <Html
          position={[0, appearance.size * scale + 0.5, 0]}
          center
          distanceFactor={10}
          occlude
        >
          <div className={`spacecraft-label ${hovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
            <div className="spacecraft-name">
              {getSpacecraftEmoji(spacecraftData.type, spacecraftData.id)} {spacecraftData.name}
            </div>
            {hovered && (
              <div className="spacecraft-info">
                <div>Type: {spacecraftData.type}</div>
                <div>Status: {spacecraftData.isActive ? 'Active' : 'Inactive'}</div>
                {spacecraftData.altitude && <div>Altitude: {spacecraftData.altitude}</div>}
                {spacecraftData.velocity && <div>Velocity: {spacecraftData.velocity}</div>}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}