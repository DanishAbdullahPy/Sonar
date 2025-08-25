// app/dashboard/solar-system/components/TimeControls.js
import { useState, useEffect } from 'react';

export default function TimeControls({ 
  onTimeChange, 
  timeSpeed = 1, 
  onSpeedChange, 
  onPlayPause,
  isPlaying = true,
  currentTime = 0
}) {
  const [localTime, setLocalTime] = useState(currentTime);
  
  const speedOptions = [
    { label: "Pause", value: 0, icon: "⏸️" },
    { label: "1x", value: 1, icon: "▶️" },
    { label: "10x", value: 10, icon: "⏩" },
    { label: "100x", value: 100, icon: "⏭️" },
    { label: "1000x", value: 1000, icon: "🚀" }
  ];

  useEffect(() => {
    setLocalTime(currentTime);
  }, [currentTime]);

  const handleReset = () => {
    setLocalTime(0);
    onTimeChange?.(0);
  };

  const formatTime = (time) => {
    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="time-controls">
      <div className="control-panel">
        <div className="time-display">
          <div className="time-label">Simulation Time</div>
          <div className="time-value">{formatTime(localTime)}</div>
        </div>
        
        <div className="speed-controls">
          <div className="speed-label">Speed</div>
          <div className="speed-buttons">
            {speedOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onSpeedChange?.(option.value)}
                className={`speed-btn ${timeSpeed === option.value ? 'active' : ''}`}
                title={option.label}
              >
                <span className="speed-icon">{option.icon}</span>
                <span className="speed-text">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="control-buttons">
          <button onClick={handleReset} className="reset-btn" title="Reset Time">
            🔄 Reset
          </button>
          
          <div className="real-time-indicator">
            <div className={`status-dot ${isPlaying ? 'playing' : 'paused'}`}></div>
            <span>{isPlaying ? 'Running' : 'Paused'}</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .time-controls {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }
        
        .control-panel {
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          min-width: 320px;
        }
        
        .time-display {
          margin-bottom: 16px;
          text-align: center;
        }
        
        .time-label {
          font-size: 12px;
          color: #888;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .time-value {
          font-size: 18px;
          font-weight: 600;
          color: #00ff88;
          font-family: 'JetBrains Mono', monospace;
        }
        
        .speed-controls {
          margin-bottom: 16px;
        }
        
        .speed-label {
          font-size: 12px;
          color: #888;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .speed-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .speed-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }
        
        .speed-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .speed-btn.active {
          background: rgba(0, 255, 136, 0.2);
          border-color: #00ff88;
          color: #00ff88;
        }
        
        .speed-icon {
          font-size: 14px;
        }
        
        .control-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .reset-btn {
          background: rgba(255, 69, 58, 0.2);
          border: 1px solid rgba(255, 69, 58, 0.3);
          border-radius: 8px;
          padding: 8px 16px;
          color: #ff453a;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
        }
        
        .reset-btn:hover {
          background: rgba(255, 69, 58, 0.3);
        }
        
        .real-time-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #888;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .status-dot.playing {
          background: #00ff88;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        .status-dot.paused {
          background: #ff453a;
          box-shadow: 0 0 10px rgba(255, 69, 58, 0.5);
        }
        
        @media (max-width: 768px) {
          .time-controls {
            bottom: 80px;
            left: 10px;
            right: 10px;
          }
          
          .control-panel {
            padding: 12px;
            min-width: auto;
          }
          
          .time-display {
            margin-bottom: 12px;
          }
          
          .time-value {
            font-size: 16px;
          }
          
          .speed-controls {
            margin-bottom: 12px;
          }
          
          .speed-buttons {
            justify-content: center;
            gap: 4px;
          }
          
          .speed-btn {
            flex: 1;
            min-width: 50px;
            justify-content: center;
            padding: 6px 8px;
          }
          
          .speed-text {
            display: none;
          }
          
          .speed-icon {
            font-size: 12px;
          }
          
          .control-buttons {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          
          .reset-btn {
            text-align: center;
          }
          
          .real-time-indicator {
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .time-controls {
            bottom: 70px;
            left: 5px;
            right: 5px;
          }
          
          .control-panel {
            padding: 10px;
          }
          
          .speed-btn {
            min-width: 40px;
            padding: 4px 6px;
          }
        }
      `}</style>
    </div>
  );
}