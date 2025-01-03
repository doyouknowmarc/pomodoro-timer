import React from 'react';
import { Settings } from 'lucide-react';

interface TimerConfigProps {
  duration: number;
  onDurationChange: (minutes: number) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function TimerConfig({ duration, onDurationChange, isEditing, onToggleEdit }: TimerConfigProps) {
  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <input
          type="number"
          value={Math.floor(duration / 60)}
          onChange={(e) => onDurationChange(Math.max(1, parseInt(e.target.value, 10)))}
          className="w-16 bg-white/20 text-white border border-white/30 rounded px-2 py-1"
          min="1"
          autoFocus
        />
      ) : (
        <span className="text-white/80">{Math.floor(duration / 60)}min</span>
      )}
      <button
        onClick={onToggleEdit}
        className="text-white/80 hover:text-white"
        title="Configure timer duration"
      >
        <Settings size={16} />
      </button>
    </div>
  );
}