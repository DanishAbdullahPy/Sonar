// app/api/planets/realtime/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude') || '28.627222';
  const longitude = searchParams.get('longitude') || '-80.620833';
  const time = searchParams.get('time') || null;
  
  try {
    
    // Build API URL
    const apiUrl = new URL('https://api.visibleplanets.dev/v3');
    apiUrl.searchParams.set('latitude', latitude);
    apiUrl.searchParams.set('longitude', longitude);
    apiUrl.searchParams.set('showCoords', 'true');
    apiUrl.searchParams.set('aboveHorizon', 'false'); // Get all planets
    
    if (time) {
      apiUrl.searchParams.set('time', time);
    }

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Space-Dashboard/1.0'
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      console.error(`Visible Planets API error: ${response.status} ${response.statusText}`);
      throw new Error(`Visible Planets API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !data.data) {
      throw new Error('Invalid response format from Visible Planets API');
    }
    
    // Transform the data to match our solar system format
    const transformedData = {
      timestamp: new Date().toISOString(),
      location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      planets: {},
      meta: data.meta || {}
    };

    // Map API data to our planet structure
    if (data.data) {
      data.data.forEach(body => {
        const planetName = body.name.toLowerCase();
        
        // Skip non-planetary bodies for now
        if (['sun', 'moon'].includes(planetName)) return;
        
        transformedData.planets[planetName] = {
          name: body.name,
          isVisible: body.aboveHorizon,
          altitude: body.altitude,
          azimuth: body.azimuth,
          magnitude: body.magnitude,
          constellation: body.constellation,
          coordinates: {
            rightAscension: {
              hours: body.rightAscension?.hours || 0,
              minutes: body.rightAscension?.minutes || 0,
              seconds: body.rightAscension?.seconds || 0
            },
            declination: {
              degrees: body.declination?.degrees || 0,
              arcminutes: body.declination?.arcminutes || 0,
              arcseconds: body.declination?.arcseconds || 0,
              negative: body.declination?.negative || false
            }
          },
          // Convert astronomical coordinates to 3D positions
          position3D: convertToCartesian(body.altitude, body.azimuth, planetName)
        };
      });
    }

    return NextResponse.json(transformedData);
    
  } catch (error) {
    console.error('Error fetching real-time planetary data:', error);
    
    // Return fallback data structure instead of error
    const fallbackData = {
      timestamp: new Date().toISOString(),
      location: { 
        latitude: parseFloat(latitude), 
        longitude: parseFloat(longitude) 
      },
      planets: generateFallbackPlanetData(),
      meta: { 
        source: 'fallback', 
        error: error.message,
        note: 'Using simulated data due to API unavailability'
      }
    };
    
    return NextResponse.json(fallbackData);
  }
}

// Generate fallback planet data for when the API is unavailable
function generateFallbackPlanetData() {
  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  const fallbackData = {};
  
  planets.forEach(planetName => {
    // Generate some reasonable fallback values
    const altitude = Math.random() * 180 - 90; // -90 to 90 degrees
    const azimuth = Math.random() * 360; // 0 to 360 degrees
    const magnitude = Math.random() * 6 - 2; // -2 to 4 magnitude
    
    fallbackData[planetName] = {
      name: planetName.charAt(0).toUpperCase() + planetName.slice(1),
      isVisible: altitude > 0,
      altitude: altitude,
      azimuth: azimuth,
      magnitude: magnitude,
      constellation: 'Unknown',
      coordinates: {
        rightAscension: { hours: 0, minutes: 0, seconds: 0 },
        declination: { degrees: 0, arcminutes: 0, arcseconds: 0, negative: false }
      },
      position3D: convertToCartesian(altitude, azimuth, planetName)
    };
  });
  
  return fallbackData;
}

// Helper function to convert altitude/azimuth to 3D Cartesian coordinates
function convertToCartesian(altitude, azimuth, planetName) {
  // Get base distance from our static data
  const basePlanetDistances = {
    mercury: 3.9,
    venus: 7.2,
    earth: 10,
    mars: 15.2,
    jupiter: 52,
    saturn: 95.4,
    uranus: 192,
    neptune: 301
  };
  
  const distance = basePlanetDistances[planetName] || 10;
  
  // Convert spherical coordinates to Cartesian
  const altRad = (altitude * Math.PI) / 180;
  const azRad = (azimuth * Math.PI) / 180;
  
  const x = distance * Math.cos(altRad) * Math.sin(azRad);
  const y = distance * Math.sin(altRad);
  const z = distance * Math.cos(altRad) * Math.cos(azRad);
  
  return { x, y, z };
}