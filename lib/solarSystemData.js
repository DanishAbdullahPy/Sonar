export const PLANETS = {
  mercury: {
    name: "Mercury",
    radius: 0.383,           // Relative to Earth
    distance: 0.39,          // AU from Sun
    orbitalPeriod: 87.97,    // Earth days
    rotationPeriod: 58.65,   // Earth days
    axialTilt: 0.034,        // degrees
    rotationSpeed: 0.00001,  // radians per frame for smooth animation
    color: "#8C7853",
    texture: "/textures/planets/mercury/albedo.svg",
    normalMap: "/textures/planets/mercury/normal.jpg",
    roughnessMap: "/textures/planets/mercury/roughness.jpg",
    mass: 0.055,             // Relative to Earth
    moons: [],
    apiName: "mercury",
    description: "The smallest planet and closest to the Sun"
  },
  venus: {
    name: "Venus",
    radius: 0.949,
    distance: 0.72,
    orbitalPeriod: 224.7,
    rotationPeriod: -243,    // Retrograde rotation
    axialTilt: 177.4,        // degrees (retrograde)
    rotationSpeed: -0.000004, // negative for retrograde
    color: "#FFC649",
    texture: "/textures/planets/venus/albedo.svg",
    normalMap: "/textures/planets/venus/normal.jpg",
    mass: 0.815,
    moons: [],
    apiName: "venus",
    atmosphere: {
      color: "#FFC649",
      opacity: 0.15,
      scale: 1.05
    },
    description: "The hottest planet with a thick, toxic atmosphere"
  },
  earth: {
    name: "Earth",
    radius: 1.0,
    distance: 1.0,
    orbitalPeriod: 365.25,
    rotationPeriod: 1,
    axialTilt: 23.44,        // degrees
    rotationSpeed: 0.01,     // radians per frame
    color: "#6B93D6",
    texture: "/textures/planets/earth/albedo.svg",
    normalMap: "/textures/planets/earth/normal.jpg",
    roughnessMap: "/textures/planets/earth/roughness.jpg",
    mass: 1.0,
    moons: ["moon"],
    apiName: "earth",
    atmosphere: {
      color: "#87CEEB",
      opacity: 0.1,
      scale: 1.02
    },
    description: "Our home planet, the only known world with life"
  },
  mars: {
    name: "Mars",
    radius: 0.532,
    distance: 1.52,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    axialTilt: 25.19,        // degrees
    rotationSpeed: 0.0097,   // radians per frame
    color: "#CD5C5C",
    texture: "/textures/planets/mars/albedo.svg",
    normalMap: "/textures/planets/mars/normal.jpg",
    roughnessMap: "/textures/planets/mars/roughness.jpg",
    mass: 0.107,
    moons: ["phobos", "deimos"],
    apiName: "mars",
    atmosphere: {
      color: "#CD853F",
      opacity: 0.05,
      scale: 1.01
    },
    description: "The Red Planet, target for future human exploration"
  },
  jupiter: {
    name: "Jupiter",
    radius: 11.21,
    distance: 5.2,
    orbitalPeriod: 4333,
    rotationPeriod: 0.41,
    axialTilt: 3.13,         // degrees
    rotationSpeed: 0.024,    // fast rotation
    color: "#D8CA9D",
    texture: "/textures/planets/jupiter/albedo.svg",
    normalMap: "/textures/planets/jupiter/normal.jpg",
    mass: 317.8,
    moons: ["io", "europa", "ganymede", "callisto"],
    apiName: "jupiter",
    atmosphere: {
      color: "#D2B48C",
      opacity: 0.08,
      scale: 1.03
    },
    description: "The largest planet, a gas giant with a Great Red Spot"
  },
  saturn: {
    name: "Saturn",
    radius: 9.45,
    distance: 9.54,
    orbitalPeriod: 10759,
    rotationPeriod: 0.45,
    axialTilt: 26.73,        // degrees
    rotationSpeed: 0.022,    // fast rotation
    color: "#FAD5A5",
    texture: "/textures/planets/saturn/albedo.svg",
    normalMap: "/textures/planets/saturn/normal.jpg",
    mass: 95.2,
    moons: ["titan", "enceladus", "mimas"],
    apiName: "saturn",
    rings: {
      texture: "/textures/planets/saturn/rings.svg",
      innerRadius: 1.2,
      outerRadius: 2.5,
      tilt: 26.73
    },
    atmosphere: {
      color: "#F4E4BC",
      opacity: 0.06,
      scale: 1.02
    },
    description: "The ringed planet, famous for its spectacular ring system"
  },
  uranus: {
    name: "Uranus",
    radius: 4.01,
    distance: 19.2,
    orbitalPeriod: 30687,
    rotationPeriod: -0.72,   // retrograde
    axialTilt: 97.77,        // extreme tilt
    rotationSpeed: -0.014,   // retrograde rotation
    color: "#4FD0E7",
    texture: "/textures/planets/uranus/albedo.svg",
    normalMap: "/textures/planets/uranus/normal.jpg",
    mass: 14.5,
    moons: ["miranda", "ariel", "umbriel"],
    apiName: "uranus",
    rings: {
      texture: "/textures/planets/uranus/rings.svg",
      innerRadius: 1.8,
      outerRadius: 2.2,
      tilt: 97.77
    },
    atmosphere: {
      color: "#4FD0E7",
      opacity: 0.08,
      scale: 1.02
    },
    description: "An ice giant tilted on its side with faint rings"
  },
  neptune: {
    name: "Neptune",
    radius: 3.88,
    distance: 30.1,
    orbitalPeriod: 60190,
    rotationPeriod: 0.67,
    axialTilt: 28.32,        // degrees
    rotationSpeed: 0.015,    // radians per frame
    color: "#4B70DD",
    texture: "/textures/planets/neptune/albedo.svg",
    normalMap: "/textures/planets/neptune/normal.jpg",
    mass: 17.1,
    moons: ["triton"],
    apiName: "neptune",
    atmosphere: {
      color: "#4169E1",
      opacity: 0.1,
      scale: 1.03
    },
    description: "The windiest planet, an ice giant with supersonic winds"
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