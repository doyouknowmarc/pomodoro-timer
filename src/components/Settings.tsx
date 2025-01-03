import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ThemeSettings } from '../types';

interface SettingsProps {
  settings: ThemeSettings;
  onSettingsChange: (settings: ThemeSettings) => void;
  workDuration: number;
  breakDuration: number;
  onWorkDurationChange: (duration: number) => void;
  onBreakDurationChange: (duration: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Settings({
  settings,
  onSettingsChange,
  workDuration,
  breakDuration,
  onWorkDurationChange,
  onBreakDurationChange,
  isOpen,
  onToggle,
}: SettingsProps) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
        title="Open settings"
      >
        <SettingsIcon size={24} />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-lg p-6 shadow-lg transform transition-transform">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <button
          onClick={onToggle}
          className="text-white/70 hover:text-white"
          title="Close settings"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-white/90 font-medium">Timer Settings</h3>
          <div className="space-y-2">
            <label className="block text-white/70 text-sm">
              Work Duration (minutes)
              <input
                type="number"
                value={Math.floor(workDuration / 60)}
                onChange={(e) => onWorkDurationChange(Math.max(1, parseInt(e.target.value, 10)) * 60)}
                className="w-full bg-white/10 text-white mt-1 px-3 py-2 rounded"
                min="1"
              />
            </label>
            <label className="block text-white/70 text-sm">
              Break Duration (minutes)
              <input
                type="number"
                value={Math.floor(breakDuration / 60)}
                onChange={(e) => onBreakDurationChange(Math.max(1, parseInt(e.target.value, 10)) * 60)}
                className="w-full bg-white/10 text-white mt-1 px-3 py-2 rounded"
                min="1"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white/90 font-medium">Theme Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center text-white/70">
              <input
                type="checkbox"
                checked={settings.useGradient}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  useGradient: e.target.checked
                })}
                className="mr-2"
              />
              Use Gradient Background
            </label>

            {settings.useGradient && (
              <label className="block text-white/70 text-sm">
                Animation Speed (seconds)
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={settings.gradientAnimationDuration}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    gradientAnimationDuration: parseInt(e.target.value, 10)
                  })}
                  className="w-full mt-1"
                />
                <span className="text-white/50 text-xs">{settings.gradientAnimationDuration}s</span>
              </label>
            )}

            {!settings.useGradient && (
              <label className="block text-white/70 text-sm">
                Background Color
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    backgroundColor: e.target.value
                  })}
                  className="block w-full h-8 mt-1"
                />
              </label>
            )}

            <label className="block text-white/70 text-sm">
              Text Color
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  textColor: e.target.value
                })}
                className="block w-full h-8 mt-1"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}