// app/dashboard/solar-system/components/TimeControls.js
import { useState } from 'react';

export default function TimeControls({ onTimeChange, timeSpeed, onSpeedChange }) {
  const [isPlaying, setIsPlaying] = useState(true);
  
  const speedOptions = [
    { label: "1x", value: 1 },
    { label: "10x", value: 10 },
    { label: "100x", value: 100 },
    { label: "1000x", value: 1000 }
  ];

  return (
    <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white">
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        {/* Speed Controls */}
        <div className="flex gap-2">
          {speedOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSpeedChange(option.value)}
              className={`px-3 py-1 rounded ${
                timeSpeed === option.value 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Date Display */}
        <div className="text-sm text-gray-300">
          Current Date: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}