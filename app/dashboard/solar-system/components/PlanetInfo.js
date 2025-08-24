// app/dashboard/solar-system/components/PlanetInfo.js
export default function PlanetInfo({ planet, onClose, realTimeData }) {
  if (!planet) return null;

  const visibility = planet.visibility || null;
  const hasRealTimeData = realTimeData && realTimeData.planets && realTimeData.planets[planet.apiName];

  return (
    <div className="absolute top-6 right-6 bg-black/90 backdrop-blur-sm rounded-xl p-6 text-white max-w-sm border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{planet.name || 'Unknown Planet'}</h2>
          {hasRealTimeData && (
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${visibility?.isVisible ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <span className="text-xs text-gray-400">
                {visibility?.isVisible ? 'Visible in sky' : 'Below horizon'}
              </span>
            </div>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>
      
      {/* Real-time visibility data */}
      {hasRealTimeData && visibility && (
        <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">🌌 Current Sky Position</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Altitude:</span>
              <span className="ml-1">{visibility.altitude?.toFixed(1) || 'N/A'}°</span>
            </div>
            <div>
              <span className="text-gray-400">Azimuth:</span>
              <span className="ml-1">{visibility.azimuth?.toFixed(1) || 'N/A'}°</span>
            </div>
            <div>
              <span className="text-gray-400">Magnitude:</span>
              <span className="ml-1">{visibility.magnitude?.toFixed(1) || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400">Constellation:</span>
              <span className="ml-1">{visibility.constellation || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Static planetary data */}
      <div className="space-y-3 text-sm">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">📊 Planetary Data</h3>
        <div className="flex justify-between">
          <span className="text-gray-400">Distance from Sun:</span>
          <span>{planet.distance || 'N/A'} AU</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Orbital Period:</span>
          <span>{planet.orbitalPeriod || 'N/A'} Earth days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Rotation Period:</span>
          <span>{planet.rotationPeriod ? Math.abs(planet.rotationPeriod) : 'N/A'} Earth days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Relative Mass:</span>
          <span>{planet.mass || 'N/A'}x Earth</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Moons:</span>
          <span>{planet.moons ? planet.moons.length : 0}</span>
        </div>
      </div>

      {/* Data source indicator */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500">
        {hasRealTimeData ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time data from your location
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            Simulated orbital mechanics
          </div>
        )}
      </div>
    </div>
  );
}