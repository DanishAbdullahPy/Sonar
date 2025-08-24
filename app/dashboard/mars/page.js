'use client';
import { useState, useEffect } from 'react';
import { useFirebaseUser } from "@/lib/useFirebaseUser";
import { useRouter } from "next/navigation";

// Mars rover photos component
const MarsRoverPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [sol, setSol] = useState(1000);
  const [rover, setRover] = useState('Curiosity');
  const [error, setError] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [failedImages, setFailedImages] = useState(new Set());

  // Camera options per rover with better organization
  const CAMERA_OPTIONS = {
    Curiosity: [
      { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
      { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
      { value: 'MAST', label: 'Mast Camera' },
      { value: 'CHEMCAM', label: 'Chemistry and Camera Complex' },
      { value: 'MAHLI', label: 'Mars Hand Lens Imager' },
      { value: 'MARDI', label: 'Mars Descent Imager' },
      { value: 'NAVCAM', label: 'Navigation Camera' },
    ],
    Opportunity: [
      { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
      { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
      { value: 'NAVCAM', label: 'Navigation Camera' },
      { value: 'PANCAM', label: 'Panoramic Camera' },
      { value: 'MINITES', label: 'Miniature Thermal Emission Spectrometer (Mini-TES)' },
    ],
    Spirit: [
      { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
      { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
      { value: 'NAVCAM', label: 'Navigation Camera' },
      { value: 'PANCAM', label: 'Panoramic Camera' },
      { value: 'MINITES', label: 'Miniature Thermal Emission Spectrometer (Mini-TES)' },
    ],
  };

  // Rover information for better UX
  const ROVER_INFO = {
    Curiosity: {
      status: 'Active',
      description: 'Nuclear-powered rover, still exploring Mars',
      recommendedSol: 1000,
      maxSol: 4000,
      color: 'bg-green-600'
    },
    Opportunity: {
      status: 'Mission Complete',
      description: 'Solar-powered rover, mission ended in 2018',
      recommendedSol: 1000,
      maxSol: 5352,
      color: 'bg-yellow-600'
    },
    Spirit: {
      status: 'Mission Complete',
      description: 'Solar-powered rover, mission ended in 2010',
      recommendedSol: 500,
      maxSol: 2208,
      color: 'bg-red-600'
    }
  };

  // Enhanced URL security and fallback handling
  const secureUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    return url.replace(/^http:/i, 'https:');
  };

  // Generate fallback image URL for older rovers
  const getFallbackImageUrl = (photo) => {
    if (!photo) return null;
    
    // Try different URL patterns for older rovers
    const baseUrl = photo.img_src;
    if (baseUrl) {
      // Convert to HTTPS
      const httpsUrl = secureUrl(baseUrl);
      
      // For Spirit and Opportunity, try alternative URL patterns
      if (rover === 'Spirit' || rover === 'Opportunity') {
        // Try replacing domain patterns that might be outdated
        const alternativeUrl = httpsUrl
          .replace('mars.jpl.nasa.gov', 'mars.nasa.gov')
          .replace('marsrovers.jpl.nasa.gov', 'mars.nasa.gov');
        
        return alternativeUrl !== httpsUrl ? alternativeUrl : httpsUrl;
      }
      
      return httpsUrl;
    }
    
    return null;
  };

  const fetchPhotos = async (page = 1) => {
    setLoading(true);
    setError(null);
    setFailedImages(new Set());
    setImageLoadingStates({});

    try {
      const params = new URLSearchParams({
        rover: rover,
        sol: sol.toString(),
        page: page.toString(),
        api_key: process.env.NASA_API_KEY
      });

      if (selectedCamera) {
        params.append('camera', selectedCamera);
      }

      const response = await fetch(`/api/mars/photos?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Mars photos');
      }

      const data = await response.json();
      setPhotos(data.photos || []);
      setTotalPages(Math.min(3, Math.ceil((data.photos?.length || 0) / 10))); // Limit to 3 pages
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(1);
  }, [rover, sol, selectedCamera]);

  const handlePageChange = (page) => {
    fetchPhotos(page);
  };

  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
  };

  const handleSolChange = (e) => {
    const newSol = parseInt(e.target.value) || ROVER_INFO[rover].recommendedSol;
    setSol(newSol);
  };

  const handleRoverChange = (e) => {
    const nextRover = e.target.value;
    setRover(nextRover);
    
    // Set recommended sol for the selected rover
    setSol(ROVER_INFO[nextRover].recommendedSol);
    
    // Reset camera if it's not supported by the selected rover
    if (
      selectedCamera &&
      !CAMERA_OPTIONS[nextRover].some((opt) => opt.value === selectedCamera)
    ) {
      setSelectedCamera('');
    }
  };

  // Handle image loading states
  const handleImageLoad = (photoId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [photoId]: false
    }));
  };

  const handleImageError = (photoId, photo, e) => {
    const currentSrc = e.currentTarget.src;
    const fallbackUrl = getFallbackImageUrl(photo);
    
    // Try fallback URL if available and different from current
    if (fallbackUrl && currentSrc !== fallbackUrl && !failedImages.has(photoId)) {
      e.currentTarget.src = fallbackUrl;
      setFailedImages(prev => new Set([...prev, photoId]));
    } else {
      // Mark as failed and show placeholder
      setFailedImages(prev => new Set([...prev, photoId]));
      setImageLoadingStates(prev => ({
        ...prev,
        [photoId]: false
      }));
    }
  };

  const handleImageLoadStart = (photoId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [photoId]: true
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-xl p-6 shadow-lg border border-[#1e293b]">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-4xl">🚀</span> Mars Rover Photos
        </h2>

        {/* Rover Information Card */}
        <div className="mb-6 p-4 bg-[#1e293b] rounded-lg border border-[#334155]">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${ROVER_INFO[rover].color}`}>
              {ROVER_INFO[rover].status}
            </span>
            <h3 className="text-xl font-semibold text-white">{rover} Rover</h3>
          </div>
          <p className="text-gray-300 text-sm mb-2">{ROVER_INFO[rover].description}</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Recommended Sol: {ROVER_INFO[rover].recommendedSol}</span>
            <span>Max Sol: {ROVER_INFO[rover].maxSol}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rover</label>
            <select 
              value={rover} 
              onChange={handleRoverChange}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="Curiosity">🤖 Curiosity (Active)</option>
              <option value="Opportunity">🔋 Opportunity (Retired)</option>
              <option value="Spirit">⚡ Spirit (Retired)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sol (Martian Day)
              <span className="text-xs text-gray-400 ml-2">Max: {ROVER_INFO[rover].maxSol}</span>
            </label>
            <input 
              type="number" 
              value={sol} 
              onChange={handleSolChange}
              min="0"
              max={ROVER_INFO[rover].maxSol}
              placeholder={`Try ${ROVER_INFO[rover].recommendedSol}`}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Camera</label>
            <select 
              value={selectedCamera} 
              onChange={handleCameraChange}
              className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">📷 All Cameras</option>
              {CAMERA_OPTIONS[rover].map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value === 'FHAZ' ? '🔍' : opt.value === 'RHAZ' ? '👁️' : opt.value === 'MAST' ? '📸' : opt.value === 'NAVCAM' ? '🧭' : '📷'} {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">Camera options adapt to the selected rover</p>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map(photo => (
                <div key={photo.id} className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg border border-[#334155] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/50">
                  <div className="aspect-square relative bg-[#0b1220]">
                    {imageLoadingStates[photo.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0b1220]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    
                    {failedImages.has(photo.id) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0b1220] text-gray-400">
                        <span className="text-4xl mb-2">📷</span>
                        <span className="text-sm text-center px-2">Image not available</span>
                        <span className="text-xs text-gray-500 mt-1">Sol {photo.sol}</span>
                      </div>
                    ) : (
                      <img 
                        src={secureUrl(photo.img_src)} 
                        alt={`Mars rover photo ${photo.id} from ${photo.camera.name} camera`}
                        className="w-full h-full object-cover"
                        onLoadStart={() => handleImageLoadStart(photo.id)}
                        onLoad={() => handleImageLoad(photo.id)}
                        onError={(e) => handleImageError(photo.id, photo, e)}
                        loading="lazy"
                      />
                    )}
                    
                    {/* Camera badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {photo.camera.name}
                    </div>
                    
                    {/* Sol badge */}
                    <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full">
                      Sol {photo.sol}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">Photo #{photo.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${ROVER_INFO[rover].color} text-white`}>
                        {rover}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Camera:</span>
                        <span className="font-medium">{photo.camera.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Earth Date:</span>
                        <span>{photo.earth_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sol:</span>
                        <span>{photo.sol}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-[#334155]">
                      <div className="flex gap-2">
                        <a 
                          href={secureUrl(photo.img_src)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs px-3 py-2 rounded-lg text-center transition-colors"
                        >
                          🔗 View Full Size
                        </a>
                        <button 
                          onClick={() => navigator.clipboard.writeText(secureUrl(photo.img_src))}
                          className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 text-xs px-3 py-2 rounded-lg transition-colors"
                          title="Copy image URL"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {photos.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 max-w-md mx-auto">
                  <span className="text-6xl mb-4 block">🔍</span>
                  <h3 className="text-xl font-semibold text-white mb-2">No Photos Found</h3>
                  <p className="text-gray-400 mb-4">
                    No photos found for Sol {sol} with the current camera selection.
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Try adjusting:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Different Sol (recommended: {ROVER_INFO[rover].recommendedSol})</li>
                      <li>Different camera or "All Cameras"</li>
                      <li>Lower Sol numbers for older rovers</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1e293b] text-gray-300 hover:bg-[#334155]'
                    }`}
                  >
                    Page {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function MarsPage() {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <main className="px-4 pt-28 max-w-7xl mx-auto min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <div className="mb-6 flex justify-end">
        <a href="/dashboard/mars/weather" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <span>🌡️</span> View Mars Weather
        </a>
      </div>
      <MarsRoverPhotos />
    </main>
  );
}