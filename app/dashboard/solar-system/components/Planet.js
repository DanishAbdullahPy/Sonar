// app/dashboard/solar-system/components/Planet.js
import React from 'react';
import { useTexture } from '@react-three/drei';

export default function Planet({
  planetData,
  timeOffset,
  onPlanetClick,
  realTimeData,
}) {
  // Use explicit normalMap from planetData if provided, else default convention
  const normalMapUrl =
    planetData.normalMap ||
    `/textures/planets/${planetData.name.toLowerCase()}/normal.jpg`;

  let normalMap;
  try {
    normalMap = useTexture(normalMapUrl);
  } catch (e) {
    // If texture fails to load, fallback or leave undefined
    console.warn(
      `Could not load normal map for ${planetData.name}:`,
      normalMapUrl
    );
    normalMap = null;
  }

  return (
    <mesh
      position={[planetData.distance, 0, 0]}
      onClick={() => onPlanetClick?.(planetData.name)}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[planetData.radius, 32, 32]} />
      <meshStandardMaterial
        color={planetData.color || 'white'}
        normalMap={normalMap}
        // Optionally add bumpMap, map, metalness, roughness, etc
      />
    </mesh>
  );
}
