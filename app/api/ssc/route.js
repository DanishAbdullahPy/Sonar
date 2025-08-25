
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { satelliteId, startTime, endTime, resolutionFactor } = await request.json();

    if (!satelliteId) {
      return NextResponse.json(
        { error: 'Satellite ID is required' },
        { status: 400 }
      );
    }

    try {
      // Use NASA's newer Space Physics Data Facility API instead of the older SSCWeb API
      // This API is more reliable and doesn't require XML requests
      const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;
      
      // For now, we'll simulate the API call and use mock data
      // In a real implementation, you would use the actual NASA API
      console.log(`Attempting to fetch data for satellite: ${satelliteId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration purposes, we'll always use mock data
      // In a production environment, you would implement actual API calls here
      const mockData = {
        id: satelliteId,
        name: getSatelliteName(satelliteId),
        positions: generateMockPositions(satelliteId),
        currentTime: new Date().toISOString(),
        isMock: true,
        message: 'Using simulated data. Real NASA SSC API integration would go here.'
      };
      
      return NextResponse.json(mockData);
    } catch (apiError) {
      console.error('NASA API Error:', apiError);
      
      // Fallback to mock data
      return NextResponse.json({
        id: satelliteId,
        name: getSatelliteName(satelliteId),
        positions: generateMockPositions(satelliteId),
        currentTime: new Date().toISOString(),
        isMock: true,
        error: apiError.message || 'Failed to fetch satellite data'
      });
    }
  } catch (error) {
    console.error('Error processing SSC request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get satellite name from ID
function getSatelliteName(satelliteId) {
  const satelliteNames = {
    iss: 'International Space Station',
    hst: 'Hubble Space Telescope',
    goes16: 'GOES-16',
    telesat: 'Telesat',
    default: 'Unknown Satellite'
  };
  
  return satelliteNames[satelliteId] || satelliteNames.default;
}

// Function to generate mock positions when API is unavailable
function generateMockPositions(satelliteId) {
  const positions = [];
  const now = Date.now();

  // Different orbit parameters for different satellites
  const orbitParams = {
    iss: { radius: 6371 + 408, inclination: 51.6, speed: 7.66 },
    hst: { radius: 6371 + 547, inclination: 28.5, speed: 7.56 },
    goes16: { radius: 6371 + 35786, inclination: 0.1, speed: 3.07 },
    default: { radius: 6371 + 500, inclination: 45, speed: 7.5 }
  };

  const params = orbitParams[satelliteId] || orbitParams.default;
  const radius = params.radius;
  const inclination = params.inclination * Math.PI / 180;
  const speed = params.speed;

  // Generate positions for the last 24 hours
  for (let i = 0; i < 24; i++) {
    const time = now + (i * 60 * 60 * 1000); // Hourly intervals
    const angle = (i / 24) * Math.PI * 2; // Evenly spaced around orbit

    // Calculate position in 3D space
    const x = radius * Math.cos(angle) * Math.cos(inclination);
    const y = radius * Math.sin(angle) * Math.cos(inclination);
    const z = radius * Math.sin(inclination);

    // Convert to lat/alt/lon (simplified)
    const lat = 90 - (angle * 180 / Math.PI);
    const lon = (angle * 180 / Math.PI) - 180;

    positions.push({
      time: new Date(time).toISOString(),
      position: { x, y, z },
      coordinates: {
        latitude: lat,
        longitude: lon,
        altitude: (radius - 6371).toFixed(1)
      }
    });
  }

  return positions;
}


