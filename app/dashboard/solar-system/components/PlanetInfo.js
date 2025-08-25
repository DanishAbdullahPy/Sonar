// app/dashboard/solar-system/components/PlanetInfo.js
import { useState, useEffect } from 'react';

export default function PlanetInfo({ planet, onClose, realTimeData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (planet) {
      setAnimateIn(true);
    }
  }, [planet]);

  if (!planet) return null;

  const visibility = planet.visibility || null;
  const hasRealTimeData = realTimeData && realTimeData.planets && realTimeData.planets[planet.apiName];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🌍' },
    { id: 'physical', label: 'Physical', icon: '📏' },
    { id: 'orbital', label: 'Orbital', icon: '🔄' },
    { id: 'observation', label: 'Sky View', icon: '🔭' }
  ];

  const formatNumber = (num, unit = '') => {
    if (num === null || num === undefined) return 'N/A';
    return `${num.toLocaleString()}${unit}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {planet.description || 'No description available.'}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-3 rounded-lg border border-blue-700/30">
                <div className="text-2xl mb-1">{formatNumber(planet.distance)} AU</div>
                <div className="text-xs text-gray-400">Distance from Sun</div>
              </div>
              <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 p-3 rounded-lg border border-green-700/30">
                <div className="text-2xl mb-1">{planet.moons ? planet.moons.length : 0}</div>
                <div className="text-xs text-gray-400">Known Moons</div>
              </div>
            </div>

            {planet.moons && planet.moons.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Major Moons</h4>
                <div className="flex flex-wrap gap-2">
                  {planet.moons.slice(0, 4).map(moon => (
                    <span key={moon} className="px-2 py-1 bg-gray-700 rounded text-xs capitalize">
                      {moon}
                    </span>
                  ))}
                  {planet.moons.length > 4 && (
                    <span className="px-2 py-1 bg-gray-600 rounded text-xs">
                      +{planet.moons.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'physical':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Radius</span>
                <span>{formatNumber(planet.radius)} Earth radii</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Mass</span>
                <span>{formatNumber(planet.mass)} Earth masses</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Axial Tilt</span>
                <span>{formatNumber(planet.axialTilt, '°')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Rotation Period</span>
                <span>
                  {planet.rotationPeriod ? 
                    `${Math.abs(planet.rotationPeriod).toFixed(2)} days${planet.rotationPeriod < 0 ? ' (retrograde)' : ''}` 
                    : 'N/A'
                  }
                </span>
              </div>
            </div>

            {planet.atmosphere && (
              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-3 rounded-lg border border-cyan-700/30">
                <h4 className="text-sm font-semibold text-cyan-300 mb-2">🌫️ Atmosphere</h4>
                <div className="text-xs text-gray-300">
                  Atmospheric effects visible in simulation
                </div>
              </div>
            )}

            {planet.rings && (
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-3 rounded-lg border border-yellow-700/30">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">💍 Ring System</h4>
                <div className="text-xs text-gray-300">
                  Complex ring structure with multiple divisions
                </div>
              </div>
            )}
          </div>
        );

      case 'orbital':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Orbital Period</span>
                <span>{formatNumber(planet.orbitalPeriod)} Earth days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Distance from Sun</span>
                <span>{formatNumber(planet.distance)} AU</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Orbital Speed</span>
                <span>{planet.distance ? (29.78 / Math.sqrt(planet.distance)).toFixed(1) : 'N/A'} km/s</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-3 rounded-lg border border-purple-700/30">
              <h4 className="text-sm font-semibold text-purple-300 mb-2">🔄 Orbital Mechanics</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Follows Kepler's laws of planetary motion</div>
                <div>• Orbital velocity varies with distance from Sun</div>
                <div>• Real-time simulation based on current date</div>
              </div>
            </div>
          </div>
        );

      case 'observation':
        return (
          <div className="space-y-4">
            {hasRealTimeData && visibility ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-3 rounded-lg border border-green-700/30">
                    <div className="text-lg mb-1">{visibility.altitude?.toFixed(1) || 'N/A'}°</div>
                    <div className="text-xs text-gray-400">Altitude</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-3 rounded-lg border border-blue-700/30">
                    <div className="text-lg mb-1">{visibility.azimuth?.toFixed(1) || 'N/A'}°</div>
                    <div className="text-xs text-gray-400">Azimuth</div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${visibility.isVisible ? 'bg-green-900/20 border-green-700/30' : 'bg-orange-900/20 border-orange-700/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${visibility.isVisible ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm font-semibold">
                      {visibility.isVisible ? 'Currently Visible' : 'Below Horizon'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300">
                    {visibility.isVisible ? 
                      `Look ${visibility.azimuth > 180 ? 'west' : 'east'} at ${visibility.altitude?.toFixed(0)}° elevation` :
                      'Not visible from your location at this time'
                    }
                  </div>
                </div>

                {visibility.constellation && (
                  <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-3 rounded-lg border border-indigo-700/30">
                    <h4 className="text-sm font-semibold text-indigo-300 mb-1">⭐ Constellation</h4>
                    <div className="text-sm">{visibility.constellation}</div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔭</div>
                <div className="text-gray-400 text-sm">
                  Enable location services for real-time sky position data
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`planet-info-panel ${animateIn ? 'animate-in' : ''}`}>
      <div className="panel-header">
        <div className="planet-title">
          <div className="planet-color" style={{ backgroundColor: planet.color }}></div>
          <div>
            <h2 className="planet-name">{planet.name || 'Unknown Planet'}</h2>
            {hasRealTimeData && visibility && (
              <div className="visibility-status">
                <div className={`status-indicator ${visibility.isVisible ? 'visible' : 'hidden'}`}></div>
                <span>{visibility.isVisible ? 'Visible in sky' : 'Below horizon'}</span>
              </div>
            )}
          </div>
        </div>
        <button onClick={onClose} className="close-button">✕</button>
      </div>

      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>

      <div className="data-source">
        {hasRealTimeData ? (
          <div className="source-indicator real-time">
            <div className="indicator-dot"></div>
            Real-time data from your location
          </div>
        ) : (
          <div className="source-indicator simulated">
            <div className="indicator-dot"></div>
            Simulated orbital mechanics
          </div>
        )}
      </div>

      <style jsx>{`
        .planet-info-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 400px;
          max-height: 80vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: white;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          overflow: hidden;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .planet-info-panel.animate-in {
          transform: translateX(0);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 24px 24px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .planet-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .planet-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }

        .planet-name {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .visibility-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          font-size: 12px;
          color: #888;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-indicator.visible {
          background: #00ff88;
          box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }

        .status-indicator.hidden {
          background: #ff8800;
          box-shadow: 0 0 8px rgba(255, 136, 0, 0.5);
        }

        .close-button {
          background: none;
          border: none;
          color: #888;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s ease;
        }

        .close-button:hover {
          color: white;
        }

        .tab-navigation {
          display: flex;
          padding: 0 24px;
          gap: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-button {
          background: none;
          border: none;
          color: #888;
          padding: 12px 16px;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          position: relative;
        }

        .tab-button:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-button.active {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #00ff88;
        }

        .tab-icon {
          font-size: 14px;
        }

        .tab-content {
          padding: 24px;
          max-height: 400px;
          overflow-y: auto;
        }

        .tab-content::-webkit-scrollbar {
          width: 4px;
        }

        .tab-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .tab-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .data-source {
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .source-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #888;
        }

        .indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .source-indicator.real-time .indicator-dot {
          background: #00ff88;
          animation: pulse 2s infinite;
        }

        .source-indicator.simulated .indicator-dot {
          background: #888;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .planet-info-panel {
            top: 10px;
            right: 10px;
            left: 10px;
            width: auto;
            max-height: 70vh;
          }

          .tab-button .tab-label {
            display: none;
          }

          .panel-header {
            padding: 20px 20px 12px;
          }

          .tab-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}