'use client';
import { useState, useEffect } from 'react';
import { useFirebaseUser } from "@/lib/useFirebaseUser";
import { useRouter } from "next/navigation";

const MarsWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSol, setSelectedSol] = useState('');
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch data from NASA API directly
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0');
      if (!response.ok) {
        throw new Error('Failed to fetch Mars weather data');
      }
      const data = await response.json();
      
      // Process the data to handle the different structure
      const solKeys = data?.sol_keys || [];
      const processedData = {};

      // Process each sol's data
      solKeys.forEach(sol => {
        const solData = data[sol];
        if (solData) {
          processedData[sol] = {
            // Atmospheric Temperature
            AT: {
              'Average': solData.AT?.av || 'N/A',
              'Maximum': solData.AT?.mx || 'N/A',
              'Minimum': solData.AT?.mn || 'N/A',
              'Unit': '°C'
            },
            // Pressure
            PRE: {
              'Average': solData.PRE?.av || 'N/A',
              'Maximum': solData.PRE?.mx || 'N/A',
              'Minimum': solData.PRE?.mn || 'N/A',
              'Unit': 'Pa'
            },
            // Horizontal Wind Speed
            HWS: {
              'Average': solData.HWS?.av || 'N/A',
              'Maximum': solData.HWS?.mx || 'N/A',
              'Minimum': solData.HWS?.mn || 'N/A',
              'Unit': 'm/s'
            },
            // Wind Direction
            WD: {
              'Most Common': solData.WD?.most_common?.compass_direction || 'N/A',
              'Direction': solData.WD?.most_common?.cardinal_direction || 'N/A',
              'Unit': 'degrees'
            },
            // Seasonal Info
            Season: {
              'Northern Hemisphere Season': solData.Season || 'N/A',
              'Southern Hemisphere Season': solData.Season || 'N/A'
            }
          };
        }
      });

      setWeatherData(processedData);

      // Set the first sol as default
      if (solKeys.length > 0) {
        setSelectedSol(solKeys[0]);
        // Initialize expanded sections
        const initialExpanded = {};
        Object.keys(processedData[solKeys[0]] || {}).forEach(key => {
          initialExpanded[key] = true;
        });
        setExpandedSections(initialExpanded);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSolData = (sol) => {
    if (!weatherData || !sol) return null;
    return weatherData[sol];
  };

  const WeatherCard = ({ title, icon, data, color }) => {
    return (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] shadow-lg">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xl font-bold flex items-center gap-3" style={{ color }}>
            <span className="text-2xl">{icon}</span>
            {title}
          </h3>
          <i className={`fas fa-chevron-${expandedSections[title] ? 'up' : 'down'} transition-transform duration-300`} style={{ color }}></i>
        </button>
        
        {expandedSections[title] && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="bg-[#0f172a] rounded-lg p-4 border border-[#1e293b]">
                <div className="text-sm text-gray-400 mb-1">{key}</div>
                <div className="text-lg font-mono text-white">
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSolDetails = (solData) => {
    if (!solData) return <div className="text-gray-400">No weather data available for this sol.</div>;

    return (
      <div className="space-y-6">
        <WeatherCard 
          title="Atmospheric Temperature"
          icon="🌡️"
          data={solData.AT || {}}
          color="#60a5fa"
        />
        
        <WeatherCard 
          title="Pressure"
          icon="🔽"
          data={solData.PRE || {}}
          color="#34d399"
        />
        
        <WeatherCard 
          title="Wind Speed"
          icon="💨"
          data={solData.HWS || {}}
          color="#fbbf24"
        />
        
        <WeatherCard 
          title="Wind Direction"
          icon="🧭"
          data={solData.WD || {}}
          color="#a78bfa"
        />
        
        <WeatherCard 
          title="Seasonal Information"
          icon="📊"
          data={solData.Season || {}}
          color="#fb7185"
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-xl p-6 shadow-2xl border border-[#1e293b]">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-4xl">🌡️</span>
          Mars Weather Data
          <span className="text-sm font-normal text-gray-400">Real-time Martian Weather Conditions</span>
        </h2>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading Mars weather data...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-red-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-exclamation-triangle"></i>
              <span className="font-bold">Error:</span>
            </div>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && weatherData && Object.keys(weatherData).length > 0 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Martian Sol (Day)
              </label>
              <select
                value={selectedSol}
                onChange={(e) => setSelectedSol(e.target.value)}
                className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {Object.keys(weatherData).map(sol => (
                  <option key={sol} value={sol}>Sol {sol} - Martian Day {sol}</option>
                ))}
              </select>
            </div>
            
            {/* Weather Details */}
            {renderSolDetails(getSolData(selectedSol))}
          </>
        )}
        
        {(!weatherData || Object.keys(weatherData).length === 0) && !loading && (
          <div className="text-gray-400 mt-4 text-center py-8">
            <i className="fas fa-satellite-dish text-4xl mb-4 text-gray-500"></i>
            <p>No weather data available from NASA at this time.</p>
            <p className="text-sm mt-2">Please try again later or check NASA's official Mars weather data.</p>
          </div>
        )}
      </div>
      
      {/* Mars Weather Information */}
      <div className="bg-[#1e293b] rounded-xl p-8 border border-[#334155] mt-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fas fa-info-circle text-sky-400"></i>
          About Mars Weather
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] rounded-lg p-6 border border-[#1e293b]">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🌡️</span>
              Atmospheric Conditions
            </h4>
            <p className="text-gray-300">
              Mars has a thin atmosphere composed mostly of carbon dioxide (95.3%), with nitrogen (2.7%), 
              argon (1.6%), oxygen (0.13%), and trace amounts of water vapor. The atmospheric pressure is 
              less than 1% of Earth's pressure at sea level.
            </p>
          </div>
          
          <div className="bg-[#0f172a] rounded-lg p-6 border border-[#1e293b]">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🌡️</span>
              Temperature Variations
            </h4>
            <p className="text-gray-300">
              Temperatures on Mars can range from -143°C at the winter pole to as much as 35°C in summer. 
              The thin atmosphere does not retain heat well, leading to extreme temperature variations between 
              day and night, sometimes as much as 100°C difference.
            </p>
          </div>
          
          <div className="bg-[#0f172a] rounded-lg p-6 border border-[#1e293b]">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">💨</span>
              Wind Patterns
            </h4>
            <p className="text-gray-300">
              Winds on Mars can reach up to 60 m/s (over 200 km/h), capable of moving dust across the planet 
              and creating massive dust storms that can cover the entire planet for weeks or months.
            </p>
          </div>
          
          <div className="bg-[#0f172a] rounded-lg p-6 border border-[#1e293b]">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Seasonal Changes
            </h4>
            <p className="text-gray-300">
              Mars experiences seasons similar to Earth, but they last nearly twice as long due to its 
              longer year. Each season brings unique weather patterns, including polar ice cap growth and 
              recession, and seasonal dust storms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MarsWeatherPage() {
  const { user, loading } = useFirebaseUser();
  const router = useRouter();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
  
  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <main className="px-4 pt-28 pb-12 max-w-7xl mx-auto min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <MarsWeather />
    </main>
  );
}
