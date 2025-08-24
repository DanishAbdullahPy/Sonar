// scripts/download-textures.js
// Script to download high-quality planet textures from NASA/public domain sources

const fs = require('fs');
const path = require('path');
const https = require('https');

// High-quality texture URLs from NASA and other public domain sources
const TEXTURE_URLS = {
  mercury: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    normal: 'https://www.solarsystemscope.com/textures/download/2k_mercury_normal.jpg'
  },
  venus: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    normal: 'https://www.solarsystemscope.com/textures/download/2k_venus_normal.jpg'
  },
  earth: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    normal: 'https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg',
    roughness: 'https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg'
  },
  mars: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    normal: 'https://www.solarsystemscope.com/textures/download/2k_mars_normal.jpg'
  },
  jupiter: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg'
  },
  saturn: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    rings: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png'
  },
  uranus: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg'
  },
  neptune: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg'
  },
  sun: {
    albedo: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg'
  }
};

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadTextures() {
  console.log('🌍 Starting planet texture download...\n');
  
  const baseDir = path.join(__dirname, '..', 'public', 'textures', 'planets');
  
  for (const [planet, textures] of Object.entries(TEXTURE_URLS)) {
    console.log(`📥 Downloading textures for ${planet}...`);
    
    const planetDir = path.join(baseDir, planet);
    if (!fs.existsSync(planetDir)) {
      fs.mkdirSync(planetDir, { recursive: true });
    }
    
    for (const [type, url] of Object.entries(textures)) {
      try {
        const extension = url.includes('.png') ? '.png' : '.jpg';
        const filename = `${type}${extension}`;
        const filepath = path.join(planetDir, filename);
        
        // Skip if file already exists
        if (fs.existsSync(filepath)) {
          console.log(`⏭️  Skipping ${filename} (already exists)`);
          continue;
        }
        
        await downloadFile(url, filepath);
      } catch (error) {
        console.error(`❌ Failed to download ${type} for ${planet}:`, error.message);
      }
    }
    
    console.log('');
  }
  
  console.log('🎉 Texture download complete!');
  console.log('\n📝 Note: Some textures may require manual download due to CORS restrictions.');
  console.log('Visit https://www.solarsystemscope.com/textures/ for high-quality alternatives.');
}

// Run the download
downloadTextures().catch(console.error);