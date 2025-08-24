export const PLANETS = {
  mercury: {
    name: "Mercury",
    radius: 0.383,           // Relative to Earth
    distance: 0.39,          // AU from Sun
    orbitalPeriod: 87.97,    // Earth days
    rotationPeriod: 58.65,   // Earth days
    color: "#8C7853",
    texture: "/textures/mercury.jpg",
    mass: 0.055,             // Relative to Earth
    moons: [],
    apiName: "mercury"
  },
  venus: {
    name: "Venus",
    radius: 0.949,
    distance: 0.72,
    orbitalPeriod: 224.7,
    rotationPeriod: -243,    // Retrograde rotation
    color: "#FFC649",
    texture: "/textures/venus.jpg",
    mass: 0.815,
    moons: [],
    apiName: "venus"
  },
  earth: {
    name: "Earth",
    radius: 1.0,
    distance: 1.0,
    orbitalPeriod: 365.25,
    rotationPeriod: 1,
    color: "#6B93D6",
    texture: "/textures/earth.jpg",
    mass: 1.0,
    moons: ["moon"],
    apiName: "earth"
  },
  mars: {
    name: "Mars",
    radius: 0.532,
    distance: 1.52,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    color: "#CD5C5C",
    texture: "/textures/mars.jpg",
    mass: 0.107,
    moons: ["phobos", "deimos"],
    apiName: "mars"
  },
  jupiter: {
    name: "Jupiter",
    radius: 11.21,
    distance: 5.2,
    orbitalPeriod: 4333,
    rotationPeriod: 0.41,
    color: "#D8CA9D",
    texture: "/textures/jupiter.jpg",
    mass: 317.8,
    moons: ["io", "europa", "ganymede", "callisto"],
    apiName: "jupiter"
  },
  saturn: {
    name: "Saturn",
    radius: 9.45,
    distance: 9.54,
    orbitalPeriod: 10759,
    rotationPeriod: 0.45,
    color: "#FAD5A5",
    texture: "/textures/saturn.jpg",
    mass: 95.2,
    moons: ["titan", "enceladus", "mimas"],
    apiName: "saturn"
  },
  uranus: {
    name: "Uranus",
    radius: 4.01,
    distance: 19.2,
    orbitalPeriod: 30687,
    rotationPeriod: -0.72,
    color: "#4FD0E7",
    texture: "/textures/uranus.jpg",
    mass: 14.5,
    moons: ["miranda", "ariel", "umbriel"],
    apiName: "uranus"
  },
  neptune: {
    name: "Neptune",
    radius: 3.88,
    distance: 30.1,
    orbitalPeriod: 60190,
    rotationPeriod: 0.67,
    color: "#4B70DD",
    texture: "/textures/neptune.jpg",
    mass: 17.1,
    moons: ["triton"],
    apiName: "neptune"
  }
};

// Hook to fetch real-time planetary data
export async function fetchRealTimePlanetaryData(latitude, longitude, time = null) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString()
    });
    
    if (time) {
      params.append('time', time);
    }
    
    const response = await fetch(`/api/planets/realtime?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching real-time planetary data:', error);
    return null;
  }
}