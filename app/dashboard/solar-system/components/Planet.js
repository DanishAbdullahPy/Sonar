// app/dashboard/solar-system/components/Planet.js
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import Moon from './Moon';
import Satellite from './Satellite';

export default function Planet({
  planetData,
  timeOffset = 0,
  timeSpeed = 1,
  onPlanetClick,
  realTimeData,
  showLabels = true,
  selectedPlanet
}) {
  const planetRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animation frame
  useFrame((state, delta) => {
    if (planetRef.current) {
      // Realistic planet rotation - much slower
      const rotationSpeed = (planetData.rotationSpeed || 0.001) * timeSpeed * 0.01;
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
    
    if (groupRef.current) {
      // Realistic orbital motion - much slower and based on actual orbital periods
      const orbitalSpeed = (timeSpeed * 0.001) / (planetData.orbitalPeriod || 365);
      const angle = state.clock.elapsedTime * orbitalSpeed;
      const distance = planetData.distance * 10;
      groupRef.current.position.x = Math.cos(angle) * distance;
      groupRef.current.position.z = Math.sin(angle) * distance;
    }
  });

  const isSelected = selectedPlanet === planetData.name;
  const planetScale = isSelected ? planetData.radius * 1.2 : planetData.radius;

  return (
    <group ref={groupRef}>
      {/* Planet */}
      <mesh
        ref={planetRef}
        onClick={() => onPlanetClick?.(planetData.name)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
        scale={[planetScale, planetScale, planetScale]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={planetData.color || '#888888'}
          roughness={0.8}
          metalness={0.1}
          emissive={isSelected ? planetData.color : '#000000'}
          emissiveIntensity={isSelected ? 0.1 : 0}
        />
      </mesh>

      {/* Atmosphere for applicable planets */}
      {planetData.atmosphere && (
        <mesh scale={[planetScale * planetData.atmosphere.scale, planetScale * planetData.atmosphere.scale, planetScale * planetData.atmosphere.scale]}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshBasicMaterial
            color={planetData.atmosphere.color}
            transparent
            opacity={planetData.atmosphere.opacity}
            side={2} // DoubleSide
          />
        </mesh>
      )}

      {/* Saturn's Rings */}
      {planetData.rings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planetData.rings.innerRadius * planetScale, planetData.rings.outerRadius * planetScale, 64]} />
          <meshBasicMaterial
            color="#C4A484"
            transparent
            opacity={0.8}
            side={2} // DoubleSide
          />
        </mesh>
      )}

      {/* Planet Label */}
      {showLabels && (
        <Html
          position={[0, planetScale + 1, 0]}
          center
          distanceFactor={15}
          occlude
        >
          <div className={`planet-label ${hovered ? 'hovered' : ''} ${isSelected ? 'selected' : ''}`}>
            <div className="planet-name">{planetData.name}</div>
            {hovered && (
              <div className="planet-info">
                <div>Distance: {planetData.distance} AU</div>
                <div>Radius: {planetData.radius} Earth radii</div>
                <div>Period: {planetData.orbitalPeriod} days</div>
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <ringGeometry args={[planetScale * 1.5, planetScale * 1.7, 32]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.6}
            side={2}
          />
        </mesh>
      )}

      {/* Earth's Moon and Satellites */}
      {planetData.name === 'Earth' && (
        <>
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 2.5}
            orbitSpeed={0.5} // Much slower - realistic moon speed
            size={planetScale * 0.27}
          />
          <Satellite 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 1.8}
            orbitSpeed={1} // Realistic ISS speed
            size={planetScale * 0.1}
            color="#ffffff"
            name="ISS"
          />
          <Satellite 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 2.1}
            orbitSpeed={0.8} // Realistic Hubble speed
            size={planetScale * 0.08}
            color="#ffaa00"
            name="Hubble"
          />
        </>
      )}

      {/* Mars Satellites */}
      {planetData.name === 'Mars' && (
        <>
          <Satellite 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 1.5}
            orbitSpeed={1.2} // Phobos is fast but not crazy fast
            size={planetScale * 0.05}
            color="#aa4444"
            name="Phobos"
          />
          <Satellite 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 2.2}
            orbitSpeed={0.4} // Deimos is slower
            size={planetScale * 0.03}
            color="#884444"
            name="Deimos"
          />
        </>
      )}

      {/* Jupiter's Major Moons */}
      {planetData.name === 'Jupiter' && (
        <>
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 1.8}
            orbitSpeed={0.8} // Io
            size={planetScale * 0.15}
            color="#ffaa44"
          />
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 2.2}
            orbitSpeed={0.6} // Europa
            size={planetScale * 0.12}
            color="#aaaaff"
          />
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 2.8}
            orbitSpeed={0.4} // Ganymede
            size={planetScale * 0.18}
            color="#ccaa88"
          />
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 3.5}
            orbitSpeed={0.3} // Callisto
            size={planetScale * 0.16}
            color="#888888"
          />
        </>
      )}

      {/* Saturn's Major Moons */}
      {planetData.name === 'Saturn' && (
        <>
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 3.2}
            orbitSpeed={0.3} // Titan
            size={planetScale * 0.16}
            color="#ffcc88"
          />
          <Moon 
            planetPosition={[0, 0, 0]}
            orbitRadius={planetScale * 4.1}
            orbitSpeed={0.2} // Enceladus
            size={planetScale * 0.08}
            color="#aaffff"
          />
        </>
      )}
    </group>
  );
}
