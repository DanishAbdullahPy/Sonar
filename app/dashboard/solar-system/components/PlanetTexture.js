import { useMemo } from 'react';

export default function PlanetTexture({ 
  planetData, 
  fallbackColor, 
  isEmissive = false 
}) {
  // Material properties based on planet type - using colors only for now
  const materialProps = useMemo(() => {
    const baseProps = {
      roughness: 0.8,
      metalness: 0.1,
    };

    if (isEmissive) {
      return {
        ...baseProps,
        color: fallbackColor || planetData?.color || "#FDB813",
        emissive: fallbackColor || planetData?.color || "#FDB813",
        emissiveIntensity: 0.3,
      };
    }

    return {
      ...baseProps,
      color: fallbackColor || planetData?.color || "#888888",
    };
  }, [fallbackColor, isEmissive, planetData]);

  return <meshStandardMaterial {...materialProps} />;
}