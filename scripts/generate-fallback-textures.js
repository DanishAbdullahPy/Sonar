// scripts/generate-fallback-textures.js
// Generate simple colored textures as fallbacks

const fs = require('fs');
const path = require('path');

// Simple SVG-based textures
const generatePlanetTexture = (color, name) => {
  return `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="planetGradient" cx="0.3" cy="0.3" r="0.8">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1.2" />
        <stop offset="70%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
      </radialGradient>
    </defs>
    <circle cx="256" cy="256" r="256" fill="url(#planetGradient)" />
    <text x="256" y="280" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${name}</text>
  </svg>`;
};

const generateRingTexture = () => {
  return `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ringGradient" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" style="stop-color:transparent;stop-opacity:0" />
        <stop offset="30%" style="stop-color:#FAD5A5;stop-opacity:0.8" />
        <stop offset="50%" style="stop-color:#D2B48C;stop-opacity:0.6" />
        <stop offset="70%" style="stop-color:#FAD5A5;stop-opacity:0.4" />
        <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
      </radialGradient>
    </defs>
    <circle cx="256" cy="256" r="256" fill="url(#ringGradient)" />
  </svg>`;
};

const PLANET_COLORS = {
  mercury: '#8C7853',
  venus: '#FFC649',
  earth: '#6B93D6',
  mars: '#CD5C5C',
  jupiter: '#D8CA9D',
  saturn: '#FAD5A5',
  uranus: '#4FD0E7',
  neptune: '#4B70DD',
  sun: '#FDB813'
};

function generateFallbackTextures() {
  console.log('🎨 Generating fallback textures...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'textures', 'planets');
  
  for (const [planet, color] of Object.entries(PLANET_COLORS)) {
    console.log(`🖼️  Generating textures for ${planet}...`);
    
    const planetDir = path.join(baseDir, planet);
    if (!fs.existsSync(planetDir)) {
      fs.mkdirSync(planetDir, { recursive: true });
    }
    
    // Generate albedo texture
    const albedoPath = path.join(planetDir, 'albedo.svg');
    if (!fs.existsSync(albedoPath)) {
      fs.writeFileSync(albedoPath, generatePlanetTexture(color, planet.charAt(0).toUpperCase() + planet.slice(1)));
      console.log(`✓ Generated albedo.svg`);
    }
    
    // Generate ring textures for Saturn and Uranus
    if (planet === 'saturn' || planet === 'uranus') {
      const ringPath = path.join(planetDir, 'rings.svg');
      if (!fs.existsSync(ringPath)) {
        fs.writeFileSync(ringPath, generateRingTexture());
        console.log(`✓ Generated rings.svg`);
      }
    }
  }
  
  console.log('\n🎉 Fallback texture generation complete!');
  console.log('📝 Note: SVG textures are lightweight fallbacks. For production, use high-quality JPG/PNG textures.');
}

// Run the generation
generateFallbackTextures();