'use client';
import { useEffect, useState } from "react";

function formatDate(dt) {
  try { 
    return new Date(dt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch { 
    return dt; 
  }
}

// Enhanced severity assessment with detailed levels
function getSeverityLevel(eventType, eventData) {
  switch(eventType) {
    case 'FLR':
      if (eventData.flrClass) {
        const classPrefix = eventData.flrClass.charAt(0);
        if (classPrefix === 'X') return 'extreme';
        if (classPrefix === 'M') return 'strong';
        if (classPrefix === 'C') return 'moderate';
        if (classPrefix === 'B') return 'mild';
      }
      break;
    case 'GST':
      if (eventData.kpIndex) {
        const kpIndex = parseInt(eventData.kpIndex);
        if (kpIndex >= 8) return 'extreme';
        if (kpIndex >= 7) return 'strong';
        if (kpIndex >= 5) return 'moderate';
        return 'mild';
      }
      break;
    case 'CME':
      if (eventData.cmeAnalyses && eventData.cmeAnalyses.length > 0) {
        const speed = parseInt(eventData.cmeAnalyses[0].speed);
        if (speed >= 1500) return 'extreme';
        if (speed >= 1000) return 'strong';
        if (speed >= 500) return 'moderate';
        return 'mild';
      }
      break;
    case 'SEP':
      return 'moderate';
    case 'SRS':
      return 'strong';
    case 'RBE':
      return 'moderate';
    default:
      return 'mild';
  }
  return 'mild';
}

// Severity-based styling
function getSeverityStyles(severity) {
  const styles = {
    extreme: {
      bg: 'bg-gradient-to-br from-red-900/50 to-red-800/30',
      border: 'border-red-500/50',
      glow: 'shadow-red-500/20 shadow-lg',
      text: 'text-red-300',
      badge: 'bg-red-500 text-white',
      pulse: 'animate-pulse'
    },
    strong: {
      bg: 'bg-gradient-to-br from-orange-900/50 to-orange-800/30',
      border: 'border-orange-500/50',
      glow: 'shadow-orange-500/20 shadow-lg',
      text: 'text-orange-300',
      badge: 'bg-orange-500 text-white',
      pulse: ''
    },
    moderate: {
      bg: 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/30',
      border: 'border-yellow-500/50',
      glow: 'shadow-yellow-500/20 shadow-md',
      text: 'text-yellow-300',
      badge: 'bg-yellow-500 text-black',
      pulse: ''
    },
    mild: {
      bg: 'bg-gradient-to-br from-green-900/50 to-green-800/30',
      border: 'border-green-500/50',
      glow: 'shadow-green-500/20 shadow-md',
      text: 'text-green-300',
      badge: 'bg-green-500 text-white',
      pulse: ''
    }
  };
  return styles[severity] || styles.mild;
}

// Event icons with better visual appeal
function getEventIcon(eventType) {
  const icons = {
    'CME': '🌞',
    'FLR': '🔥',
    'GST': '🌊',
    'IPS': '💥',
    'RBE': '☢️',
    'MPC': '📡',
    'SEP': '⚡',
    'SRS': '☢️',
    'notification': '📢'
  };
  return icons[eventType] || '🌌';
}

// Plain English explanations
function getEventExplanation(eventType, eventData, severity) {
  const explanations = {
    'CME': {
      extreme: "A massive solar explosion is hurling billions of tons of plasma toward Earth at incredible speed. Expect major satellite disruptions and stunning auroras visible far south!",
      strong: "A powerful solar storm is heading our way. GPS and communications may be affected, with beautiful auroras likely visible in northern regions.",
      moderate: "The Sun ejected a cloud of charged particles that might cause minor satellite glitches and northern lights for aurora watchers.",
      mild: "A gentle solar breeze is flowing past Earth - minimal impact but space weather enthusiasts should keep watching!"
    },
    'FLR': {
      extreme: "The Sun just unleashed an X-class mega-flare! Radio blackouts are likely, and this could trigger geomagnetic storms in the coming days.",
      strong: "A major M-class solar flare erupted! Radio communications may be disrupted, especially on the sunlit side of Earth.",
      moderate: "A moderate C-class flare brightened the Sun's surface. Minor radio interference possible for high-frequency communications.",
      mild: "A small solar flare flickered on the Sun - barely noticeable but part of our star's natural activity cycle."
    },
    'GST': {
      extreme: "EXTREME geomagnetic storm in progress! Power grids at risk, satellites vulnerable, but auroras may be visible as far south as the Caribbean!",
      strong: "Major geomagnetic storm underway! Northern lights could reach mid-latitudes while GPS accuracy may be reduced.",
      moderate: "Moderate space weather activity - perfect conditions for aurora photography in northern regions like Canada and Alaska.",
      mild: "Gentle geomagnetic activity detected. Aurora enthusiasts in polar regions might catch a faint light show."
    },
    'SEP': {
      moderate: "High-energy particles from the Sun are streaming through space. Astronauts are taking shelter, and polar flights may be rerouted."
    },
    'SRS': {
      strong: "Solar radiation storm detected! Aviation routes over polar regions may be affected, and satellite operations are being monitored."
    },
    'RBE': {
      moderate: "Earth's radiation belts are energized by solar activity. Satellites in certain orbits are experiencing enhanced radiation exposure."
    },
    'IPS': {
      moderate: "An interplanetary shock wave is rippling through space, potentially triggering geomagnetic activity when it reaches Earth."
    },
    'MPC': {
      moderate: "Radio telescopes detected a Type II radio burst - a signature of shock waves accelerating particles in the solar corona."
    }
  };
  
  return explanations[eventType]?.[severity] || explanations[eventType]?.moderate || "Space weather event detected - monitoring for potential Earth impacts.";
}

// Educational tooltips
function getEventTooltip(eventType) {
  const tooltips = {
    'CME': "Coronal Mass Ejections are huge bubbles of gas and magnetic field released from the Sun's corona. They can cause beautiful auroras but also disrupt technology.",
    'FLR': "Solar flares are intense bursts of radiation from the Sun's surface. They're classified by strength: B, C, M, and X (strongest).",
    'GST': "Geomagnetic storms occur when solar wind disturbs Earth's magnetic field. The Kp index measures intensity from 0-9.",
    'SEP': "Solar Energetic Particles are high-speed charged particles accelerated by solar events. They pose radiation risks to astronauts and technology.",
    'SRS': "Solar Radiation Storms happen when energetic particles flood near-Earth space, affecting satellites and polar aviation routes.",
    'RBE': "Radiation Belt Enhancements occur when Earth's Van Allen belts become supercharged with particles from solar activity.",
    'IPS': "Interplanetary Shocks are fast-moving disturbances in solar wind that can compress Earth's magnetosphere.",
    'MPC': "Metric Type II Radio Bursts are radio emissions from shock waves in the Sun's corona, often preceding Earth-directed events."
  };
  return tooltips[eventType] || "A space weather phenomenon that may affect Earth's magnetic environment.";
}

// Generate shareable summary
function generateDailySummary(events) {
  if (!events.length) return "Space weather is calm today - a perfect time to enjoy the quiet cosmos! 🌌";
  
  const majorEvents = events.filter(event => {
    const severity = getSeverityLevel(event.eventType || 'unknown', event);
    return severity === 'extreme' || severity === 'strong';
  });
  
  if (majorEvents.length > 0) {
    const event = majorEvents[0];
    const eventType = event.eventType || 'unknown';
    const severity = getSeverityLevel(eventType, event);
    
    if (eventType === 'FLR' && event.flrClass) {
      return `🔥 Today: ${event.flrClass}-class solar flare erupted! ${severity === 'extreme' ? 'Major space weather impacts possible.' : 'Monitor for aurora activity tonight!'}`;
    } else if (eventType === 'CME' && event.cmeAnalyses?.[0]?.speed) {
      return `🌞 Today: Coronal mass ejection detected at ${event.cmeAnalyses[0].speed} km/s! ${parseInt(event.cmeAnalyses[0].speed) > 1000 ? 'Geomagnetic storm likely in 1-3 days!' : 'Possible aurora activity ahead!'}`;
    } else if (eventType === 'GST' && event.kpIndex) {
      return `🌊 Today: Geomagnetic storm in progress (Kp=${event.kpIndex})! ${parseInt(event.kpIndex) >= 7 ? 'Auroras visible at mid-latitudes!' : 'Northern lights active tonight!'}`;
    }
  }
  
  return `📊 Today: ${events.length} space weather event${events.length > 1 ? 's' : ''} detected. Monitoring solar activity for Earth impacts! ☀️`;
}

// Check for major events requiring alerts
function getMajorEventAlert(events) {
  const majorEvents = events.filter(event => {
    const severity = getSeverityLevel(event.eventType || 'unknown', event);
    return severity === 'extreme' || severity === 'strong';
  });
  
  if (majorEvents.length === 0) return null;
  
  const event = majorEvents[0];
  const eventType = event.eventType || 'unknown';
  const severity = getSeverityLevel(eventType, event);
  
  if (severity === 'extreme') {
    return {
      type: 'extreme',
      message: '🚨 EXTREME SPACE WEATHER ALERT: Major solar activity detected! Significant technology impacts possible.',
      details: getEventExplanation(eventType, event, severity)
    };
  } else if (severity === 'strong') {
    return {
      type: 'strong', 
      message: '⚠️ MAJOR SPACE WEATHER EVENT: Strong solar activity in progress!',
      details: getEventExplanation(eventType, event, severity)
    };
  }
  
  return null;
}

// Tooltip component
function Tooltip({ children, content }) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-blue-400 hover:text-blue-300 transition-colors"
      >
        {children}
      </button>
      {show && (
        <div className="absolute z-10 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-sm text-gray-200 -top-2 left-full ml-2">
          {content}
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default function SpaceWeatherPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [eventType, setEventType] = useState('CME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [eventType, startDate, endDate]);

  const fetchEvents = async () => {
    setLoading(true);
    setErr('');

    try {
      const params = new URLSearchParams();
      if (eventType) params.append('type', eventType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/nasa/donki?${params}`);
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      
      // Add eventType to each event for processing
      const eventsWithType = (data || []).map(event => ({
        ...event,
        eventType: eventType
      }));
      
      setEvents(eventsWithType);
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDateRange = () => {
    const now = new Date();
    const defaultEndDate = now.toISOString().slice(0, 10);
    const defaultStartDate = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
  };

  useEffect(() => {
    getDefaultDateRange();
  }, []);

  const majorAlert = getMajorEventAlert(events);
  const dailySummary = generateDailySummary(events);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            🌌 Space Weather Live
          </h1>
          <p className="text-gray-300 text-lg">Real-time solar activity and Earth impact monitoring</p>
        </div>

        {/* Major Event Alert */}
        {majorAlert && (
          <div className={`mb-6 p-4 rounded-xl border-2 ${
            majorAlert.type === 'extreme' 
              ? 'bg-red-900/30 border-red-500 animate-pulse' 
              : 'bg-orange-900/30 border-orange-500'
          }`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {majorAlert.type === 'extreme' ? '🚨' : '⚠️'}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-2">{majorAlert.message}</h3>
                <p className="text-gray-200">{majorAlert.details}</p>
              </div>
            </div>
          </div>
        )}

        {/* Daily Summary */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border border-indigo-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Today in Space Weather</h2>
              <p className="text-indigo-200">{dailySummary}</p>
            </div>
            <button
              onClick={() => navigator.share ? navigator.share({
                title: 'Space Weather Update',
                text: dailySummary,
                url: window.location.href
              }) : navigator.clipboard.writeText(dailySummary)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📤 Share
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CME">🌞 Solar Eruptions (CME)</option>
                <option value="FLR">🔥 Solar Flares (FLR)</option>
                <option value="GST">🌊 Magnetic Storms (GST)</option>
                <option value="IPS">💥 Space Shocks (IPS)</option>
                <option value="RBE">☢️ Radiation Events (RBE)</option>
                <option value="MPC">📡 Radio Bursts (MPC)</option>
                <option value="SEP">⚡ Particle Storms (SEP)</option>
                <option value="SRS">☢️ Radiation Storms (SRS)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">View Mode</label>
              <select 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cards">🎴 Card View</option>
                <option value="timeline">📅 Timeline View</option>
                <option value="compact">📋 Compact List</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-between items-center">
            <button 
              onClick={fetchEvents}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Refresh Data
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowQuiz(!showQuiz)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
              >
                🧠 Space Quiz
              </button>
              <button 
                onClick={() => window.open('https://www.spaceweatherlive.com/', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
              >
                📊 Live Charts
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <div className="text-blue-300 text-lg">Scanning the cosmos for space weather...</div>
          </div>
        )}

        {/* Error State */}
        {err && (
          <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <h3 className="font-bold text-red-300">Connection Error</h3>
                <p className="text-red-200">{err}</p>
              </div>
            </div>
          </div>
        )}

        {/* Events Display */}
        {!loading && events?.length > 0 && (
          <div className={viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
            {events.map((event, i) => {
              const severity = getSeverityLevel(event.eventType, event);
              const styles = getSeverityStyles(severity);
              const explanation = getEventExplanation(event.eventType, event, severity);
              const tooltip = getEventTooltip(event.eventType);
              
              return (
                <div 
                  key={i} 
                  className={`${styles.bg} ${styles.border} ${styles.glow} ${styles.pulse} rounded-xl p-6 border backdrop-blur transition-all hover:scale-105 transform`}
                >
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getEventIcon(event.eventType)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white">
                            {event.eventType === 'FLR' ? `${event.flrClass || 'Unknown'}-Class Solar Flare` :
                             event.eventType === 'GST' ? `Geomagnetic Storm (Kp: ${event.kpIndex || 'Unknown'})` :
                             event.eventType === 'CME' ? 'Coronal Mass Ejection' :
                             event.eventType === 'SEP' ? 'Solar Particle Event' :
                             event.eventType === 'SRS' ? 'Solar Radiation Storm' :
                             event.eventType === 'RBE' ? 'Radiation Belt Event' :
                             event.eventType === 'IPS' ? 'Interplanetary Shock' :
                             event.eventType === 'MPC' ? 'Radio Burst Event' :
                             'Space Weather Event'}
                          </h3>
                          <Tooltip content={tooltip}>
                            <span className="text-blue-400 cursor-help">ℹ️</span>
                          </Tooltip>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${styles.badge} mt-1`}>
                          {severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-300">
                      <div>{formatDate(event.startTime)}</div>
                      {event.sourceLocation && (
                        <div className="text-xs text-gray-400">📍 {event.sourceLocation}</div>
                      )}
                    </div>
                  </div>

                  {/* Plain English Explanation */}
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-white mb-2">What This Means:</h4>
                    <p className="text-gray-200 leading-relaxed">{explanation}</p>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {event.eventType === 'CME' && event.cmeAnalyses?.[0] && (
                      <div className="space-y-1">
                        <div className="text-gray-300">
                          <span className="font-medium">Speed:</span> 
                          <span className={`ml-2 font-mono ${styles.text}`}>
                            {event.cmeAnalyses[0].speed} km/s
                          </span>
                        </div>
                        <div className="text-gray-300">
                          <span className="font-medium">Width:</span> 
                          <span className="ml-2 font-mono">{event.cmeAnalyses[0].halfAngle}°</span>
                        </div>
                        <div className="text-gray-300">
                          <span className="font-medium">Type:</span> 
                          <span className="ml-2">{event.cmeAnalyses[0].type}</span>
                        </div>
                      </div>
                    )}

                    {event.eventType === 'FLR' && (
                      <div className="space-y-1">
                        <div className="text-gray-300">
                          <span className="font-medium">Class:</span> 
                          <span className={`ml-2 font-mono font-bold ${styles.text}`}>
                            {event.flrClass}
                          </span>
                        </div>
                        <div className="text-gray-300">
                          <span className="font-medium">Region:</span> 
                          <span className="ml-2">{event.activeRegionNum || "Unknown"}</span>
                        </div>
                        {event.peakTime && (
                          <div className="text-gray-300">
                            <span className="font-medium">Peak:</span> 
                            <span className="ml-2">{formatDate(event.peakTime)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {event.eventType === 'GST' && (
                      <div className="space-y-1">
                        <div className="text-gray-300">
                          <span className="font-medium">Kp Index:</span> 
                          <span className={`ml-2 font-mono font-bold ${styles.text}`}>
                            {event.kpIndex}
                          </span>
                        </div>
                        {event.phase && (
                          <div className="text-gray-300">
                            <span className="font-medium">Phase:</span> 
                            <span className="ml-2">{event.phase}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-1">
                      {event.instruments?.[0] && (
                        <div className="text-gray-300">
                          <span className="font-medium">Detected by:</span> 
                          <span className="ml-2">{event.instruments[0].name}</span>
                        </div>
                      )}
                      <div className="text-gray-300">
                        <span className="font-medium">Event ID:</span> 
                        <span className="ml-2 font-mono text-xs">{event.activityID}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                    <a 
                      href={`https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/${event.eventType}/${event.activityID}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      📊 NASA Details
                    </a>
                    <button 
                      onClick={() => {
                        const shareText = `${getEventIcon(event.eventType)} ${explanation}`;
                        if (navigator.share) {
                          navigator.share({ title: 'Space Weather Alert', text: shareText });
                        } else {
                          navigator.clipboard.writeText(shareText);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      📤 Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Events State */}
        {!loading && events.length === 0 && !err && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-2xl font-bold text-white mb-2">All Quiet in Space</h3>
            <p className="text-gray-300 mb-6">
              No {eventType} events detected in the selected timeframe. 
              The cosmos is peaceful right now!
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => {
                  const now = new Date();
                  setEndDate(now.toISOString().slice(0, 10));
                  setStartDate(new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                📅 Try Last 30 Days
              </button>
              <button 
                onClick={() => setEventType('FLR')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                🔥 Check Solar Flares
              </button>
            </div>
          </div>
        )}

        {/* Space Weather Quiz Modal */}
        {showQuiz && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-600">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">🧠 Space Weather Quiz</h3>
                <button 
                  onClick={() => setShowQuiz(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-white mb-3">What does an X-class solar flare indicate?</p>
                  <div className="space-y-2">
                    <button className="w-full text-left p-2 rounded bg-slate-600 hover:bg-slate-500 text-white transition-colors">
                      A) Mild solar activity
                    </button>
                    <button className="w-full text-left p-2 rounded bg-slate-600 hover:bg-slate-500 text-white transition-colors">
                      B) The most intense solar flares
                    </button>
                    <button className="w-full text-left p-2 rounded bg-slate-600 hover:bg-slate-500 text-white transition-colors">
                      C) Solar wind speed
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  More interactive features coming soon! 🚀
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Data provided by NASA's DONKI (Database of Notifications, Knowledge, Information)</p>
          <p className="mt-2">🌟 Stay curious about our cosmic neighborhood! 🌟</p>
        </div>
      </div>
    </main>
  );
}