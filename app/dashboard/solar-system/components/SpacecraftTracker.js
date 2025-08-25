// Spacecraft Tracker Component
import { useState, useEffect } from 'react';
import Spacecraft from './Spacecraft';

export default function SpacecraftTracker({ 
  spacecraftData, 
  onSpacecraftSelect, 
  selectedSpacecraft,
  showLabels = true 
}) {
  const [visibleSpacecraft, setVisibleSpacecraft] = useState([]);
  
  useEffect(() => {
    if (spacecraftData && spacecraftData.spacecraft) {
      // Filter for spacecraft that are reasonably close to Earth for visualization
      const filtered = spacecraftData.spacecraft.filter(craft => {
        const distance = Math.sqrt(
          craft.position.x**2 + craft.position.y**2 + craft.position.z**2
        );
        // Show spacecraft within ~100 Earth radii (reasonable for 3D scene)
        return distance < 100 && craft.isActive;
      });
      
      setVisibleSpacecraft(filtered);
    }
  }, [spacecraftData]);
  
  if (!spacecraftData || !spacecraftData.spacecraft) {
    return null;
  }
  
  return (
    <group>
      {visibleSpacecraft.map((spacecraft) => (
        <Spacecraft
          key={spacecraft.id}
          spacecraftData={spacecraft}
          onSpacecraftClick={onSpacecraftSelect}
          showLabels={showLabels}
          selectedSpacecraft={selectedSpacecraft}
        />
      ))}
      
      {/* Spacecraft tracking indicator */}
      {spacecraftData.source && (
        <group position={[0, -10, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial 
              color={spacecraftData.source === 'NASA SSC' ? '#00ff00' : '#ffaa00'} 
            />
          </mesh>
        </group>
      )}
    </group>
  );
}