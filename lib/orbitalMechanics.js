// lib/orbitalMechanics.js

// Calculate planet position using real-time data when available, fallback to simulation
export function calculatePlanetPosition(planet, timeOffset = 0, realTimeData = null) {
  // Validate planet data
  if (!planet || !planet.distance || !planet.orbitalPeriod) {
    console.warn('Invalid planet data:', planet);
    return { x: 0, y: 0, z: 0, isRealTime: false };
  }

  // Use real-time data if available
  if (realTimeData && realTimeData.planets && planet.apiName && realTimeData.planets[planet.apiName]) {
    const planetData = realTimeData.planets[planet.apiName];
    if (planetData.position3D) {
      const realTimePosition = planetData.position3D;
      return {
        x: realTimePosition.x || 0,
        y: realTimePosition.y || 0,
        z: realTimePosition.z || 0,
        isRealTime: true
      };
    }
  }
  
  // Fallback to simulated orbital mechanics
  const currentTime = Date.now() + timeOffset;
  const daysSinceEpoch = currentTime / (1000 * 60 * 60 * 24);
  
  // Simple circular orbit calculation
  const angle = (daysSinceEpoch / planet.orbitalPeriod) * 2 * Math.PI;
  
  const x = Math.cos(angle) * planet.distance * 10; // Scale for visibility
  const z = Math.sin(angle) * planet.distance * 10;
  const y = 0; // Simplified to 2D plane initially
  
  return { x, y, z, angle, isRealTime: false };
}

export function calculateRotation(planet, timeOffset = 0) {
  if (!planet || !planet.rotationPeriod) {
    return 0;
  }
  
  const currentTime = Date.now() + timeOffset;
  const daysSinceEpoch = currentTime / (1000 * 60 * 60 * 24);
  
  const rotationAngle = (daysSinceEpoch / planet.rotationPeriod) * 2 * Math.PI;
  return rotationAngle;
}

// Get real-time visibility information
export function getPlanetVisibility(planet, realTimeData) {
  if (!realTimeData || !realTimeData.planets || !planet || !planet.apiName || !realTimeData.planets[planet.apiName]) {
    return null;
  }
  
  const planetData = realTimeData.planets[planet.apiName];
  return {
    isVisible: planetData.isVisible || false,
    altitude: planetData.altitude || 0,
    azimuth: planetData.azimuth || 0,
    magnitude: planetData.magnitude || 0,
    constellation: planetData.constellation || 'Unknown'
  };
}