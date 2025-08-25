// NASA SSC (Satellite Situation Center) API Service
const SSC_BASE_URL = 'https://sscweb.gsfc.nasa.gov/WS/sscr/2';

// Popular spacecraft IDs from NASA SSC
export const SPACECRAFT_IDS = {
  // NASA Missions
  'iss': 'International Space Station',
  'hubble': 'Hubble Space Telescope',
  'jwst': 'James Webb Space Telescope',
  'chandra': 'Chandra X-ray Observatory',
  'spitzer': 'Spitzer Space Telescope',
  
  // Planetary Missions
  'juno': 'Juno (Jupiter)',
  'cassini': 'Cassini (Saturn)',
  'voyager1': 'Voyager 1',
  'voyager2': 'Voyager 2',
  'newhorizons': 'New Horizons',
  
  // Earth Observation
  'terra': 'Terra',
  'aqua': 'Aqua',
  'aura': 'Aura',
  'landsat8': 'Landsat 8',
  'landsat9': 'Landsat 9',
  
  // Solar Missions
  'soho': 'SOHO',
  'stereo_a': 'STEREO-A',
  'stereo_b': 'STEREO-B',
  'parker': 'Parker Solar Probe',
  'solar_orbiter': 'Solar Orbiter',
  
  // THEMIS Mission
  'themisa': 'THEMIS-A',
  'themisb': 'THEMIS-B',
  'themisc': 'THEMIS-C',
  'themisd': 'THEMIS-D',
  'themise': 'THEMIS-E'
};

// Create properly formatted JSON request for SSC API
const createSSCRequest = (startTime, endTime, satelliteIds, options = {}) => {
  const request = [
    "gov.nasa.gsfc.sscweb.schema.DataRequest",
    {
      "Description": "Space Dashboard spacecraft tracking request",
      "TimeInterval": [
        "gov.nasa.gsfc.sscweb.schema.TimeInterval",
        {
          "Start": [
            "javax.xml.datatype.XMLGregorianCalendar",
            startTime
          ],
          "End": [
            "javax.xml.datatype.XMLGregorianCalendar",
            endTime
          ]
        }
      ],
      "Satellites": [
        "java.util.ArrayList",
        satelliteIds.map(id => [
          "gov.nasa.gsfc.sscweb.schema.SatelliteSpecification",
          {
            "Id": id,
            "ResolutionFactor": options.resolutionFactor || 1
          }
        ])
      ],
      "OutputOptions": [
        "gov.nasa.gsfc.sscweb.schema.OutputOptions",
        {
          "AllLocationFilters": true,
          "CoordinateOptions": [
            "gov.nasa.gsfc.sscweb.schema.CoordinateOptions",
            {
              "CoordinateSystem": "GEO",
              "Component": ["X", "Y", "Z"]
            }
          ]
        }
      ]
    }
  ];
  
  return request;
};

// Fetch spacecraft locations from NASA SSC
export const fetchSpacecraftLocations = async (userLocation, timeRange = 1) => {
  try {
    const now = new Date();
    const startTime = new Date(now.getTime() - (timeRange * 60 * 60 * 1000)); // hours ago
    const endTime = now;
    
    // Format times for SSC API
    const formatTime = (date) => date.toISOString();
    
    // Select a subset of interesting spacecraft
    const selectedSpacecraft = ['iss', 'hubble', 'themisa', 'themisb', 'soho'];
    
    const requestBody = createSSCRequest(
      formatTime(startTime),
      formatTime(endTime),
      selectedSpacecraft
    );
    
    console.log('SSC Request:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${SSC_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`SSC API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('SSC Response:', data);
    
    return processSSCResponse(data);
    
  } catch (error) {
    console.warn('Failed to fetch spacecraft data from NASA SSC:', error);
    
    // Return mock data for development/fallback
    return generateMockSpacecraftData();
  }
};

// Process SSC API response into usable format
const processSSCResponse = (sscData) => {
  if (!sscData || !sscData[1] || !sscData[1].Data) {
    throw new Error('Invalid SSC response format');
  }
  
  const responseData = sscData[1];
  const spacecraft = [];
  
  if (responseData.Data[1]) {
    responseData.Data[1].forEach(satData => {
      if (satData[1] && satData[1].Id && satData[1].Coordinates) {
        const coords = satData[1].Coordinates[1];
        const latestCoord = coords[coords.length - 1]; // Get most recent position
        
        if (latestCoord && latestCoord[1]) {
          const position = latestCoord[1];
          
          spacecraft.push({
            id: satData[1].Id,
            name: SPACECRAFT_IDS[satData[1].Id] || satData[1].Id,
            position: {
              x: position.X || 0,
              y: position.Y || 0,
              z: position.Z || 0
            },
            timestamp: latestCoord[1].Time || new Date().toISOString(),
            isActive: true,
            type: getSpacecraftType(satData[1].Id)
          });
        }
      }
    });
  }
  
  return {
    spacecraft,
    timestamp: new Date().toISOString(),
    source: 'NASA SSC'
  };
};

// Determine spacecraft type for visualization
const getSpacecraftType = (id) => {
  if (id === 'iss') return 'station';
  if (id.includes('hubble') || id.includes('chandra') || id.includes('spitzer')) return 'telescope';
  if (id.includes('themis')) return 'science';
  if (id.includes('soho') || id.includes('stereo') || id.includes('parker')) return 'solar';
  if (id.includes('voyager') || id.includes('newhorizons')) return 'deep_space';
  return 'satellite';
};

// Generate mock spacecraft data for development/fallback
const generateMockSpacecraftData = () => {
  const mockSpacecraft = [
    {
      id: 'iss',
      name: 'International Space Station',
      position: { x: 6.7, y: 0, z: 0 }, // ~400km altitude
      timestamp: new Date().toISOString(),
      isActive: true,
      type: 'station',
      altitude: 408, // km
      velocity: 7.66 // km/s
    },
    {
      id: 'hubble',
      name: 'Hubble Space Telescope',
      position: { x: 7.0, y: 0, z: 0 }, // ~550km altitude
      timestamp: new Date().toISOString(),
      isActive: true,
      type: 'telescope',
      altitude: 547,
      velocity: 7.59
    },
    {
      id: 'themisa',
      name: 'THEMIS-A',
      position: { x: 15, y: 5, z: 8 }, // Elliptical orbit
      timestamp: new Date().toISOString(),
      isActive: true,
      type: 'science',
      altitude: 'Variable',
      velocity: 'Variable'
    },
    {
      id: 'soho',
      name: 'SOHO',
      position: { x: 150, y: 0, z: 0 }, // L1 point
      timestamp: new Date().toISOString(),
      isActive: true,
      type: 'solar',
      altitude: '1.5M km',
      velocity: '30 km/s'
    }
  ];
  
  return {
    spacecraft: mockSpacecraft,
    timestamp: new Date().toISOString(),
    source: 'Mock Data'
  };
};

// Get available spacecraft list
export const getAvailableSpacecraft = async () => {
  try {
    const response = await fetch(`${SSC_BASE_URL}/observatories`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch spacecraft list');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.warn('Failed to fetch spacecraft list:', error);
    return Object.keys(SPACECRAFT_IDS).map(id => ({
      id,
      name: SPACECRAFT_IDS[id]
    }));
  }
};