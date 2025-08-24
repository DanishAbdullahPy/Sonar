import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';

// Fallback 1x1 transparent PNG for missing textures
const FALLBACK_TEXTURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6X9Zc8AAAAASUVORK5CYII=';

// Function to check if a texture path is valid (not a placeholder or missing)
const isValidTexturePath = (path) => {
  return path && 
         path !== FALLBACK_TEXTURE && 
         !path.startsWith('data:') &&
         path !== '';
};

export default function PlanetTexture({ 
  planetData, 
  fallbackColor, 
  isEmissive = false 
}) {
  const planetKey = planetData?.name?.toLowerCase();
  
  // Build texture paths with fallbacks
  const albedoPath = planetData?.texture || FALLBACK_TEXTURE;
  const normalPath = planetData?.normalMap || FALLBACK_TEXTURE;
  const roughnessPath = planetData?.roughnessMap || FALLBACK_TEXTURE;
  
  // Only load textures that have valid paths
  const texturePaths = [];
  if (isValidTexturePath(albedoPath)) texturePaths.push(albedoPath);
  if (isValidTexturePath(normalPath)) texturePaths.push(normalPath);
  if (isValidTexturePath(roughnessPath)) texturePaths.push(roughnessPath);
  
  // Load only valid textures
  const loadedTextures = useTexture(texturePaths);
  
  // Map loaded textures back to their respective slots
  let textureIndex = 0;
  const albedoTexture = isValidTexturePath(albedoPath) ? loadedTextures[textureIndex++] : null;
  const normalTexture = isValidTexturePath(normalPath) ? loadedTextures[textureIndex++] : null;
  const roughnessTexture = isValidTexturePath(roughnessPath) ? loadedTextures[textureIndex] : null;
  
  // Use fallback textures if any are missing
  const finalAlbedoTexture = albedoTexture || FALLBACK_TEXTURE;
  const finalNormalTexture = normalTexture || FALLBACK_TEXTURE;
  const finalRoughnessTexture = roughnessTexture || FALLBACK_TEXTURE;

  // Material properties based on planet type and available textures
  const materialProps = useMemo(() => {
    const baseProps = {
      roughness: 0.8,
      metalness: 0.1,
    };

    if (isEmissive) {
      return {
        ...baseProps,
        emissive: fallbackColor || "#FDB813",
        emissiveIntensity: 0.3,
        map: planetData?.texture ? albedoTexture : null,
      };
    }

    // Build material with available maps
    const materialConfig = { ...baseProps };
    
    // Add albedo map if available
    if (planetData?.texture && albedoTexture) {
      materialConfig.map = albedoTexture;
    } else {
      materialConfig.color = fallbackColor || planetData?.color || "#888888";
    }
    
    // Add normal map if available
    if (planetData?.normalMap && normalTexture) {
      materialConfig.normalMap = normalTexture;
      materialConfig.normalScale = [1, 1];
    }
    
    // Add roughness map if available
    if (planetData?.roughnessMap && roughnessTexture) {
      materialConfig.roughnessMap = roughnessTexture;
    }

    return materialConfig;
  }, [albedoTexture, normalTexture, roughnessTexture, fallbackColor, isEmissive, planetData]);

  return <meshStandardMaterial {...materialProps} />;
}

// Preload commonly used textures
export const preloadPlanetTextures = (planetNames) => {
  planetNames.forEach(name => {
    const basePath = `/textures/planets/${name.toLowerCase()}`;
    useTexture.preload(`${basePath}/albedo.jpg`);
    useTexture.preload(`${basePath}/normal.jpg`);
    useTexture.preload(`${basePath}/roughness.jpg`);
  });
};