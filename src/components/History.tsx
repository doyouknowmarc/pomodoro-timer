import React from 'react';
import { PomodoroSession } from '../types';
import { Clock, Coffee } from 'lucide-react';

interface HistoryProps {
  sessions: PomodoroSession[];
  onDescriptionUpdate: (id: string, description: string) => void;
}

export default function History({ sessions, onDescriptionUpdate }: HistoryProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-md bg-white/10 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white mb-4">Session History</h2>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-col bg-white/5 p-3 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {session.type === 'work' ? (
                  <Clock className="text-white" size={20} />
                ) : (
                  <Coffee className="text-white" size={20} />
                )}
                <span className="text-white/90">
                  {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
              </div>
              <span className="text-white/75">
                {Math.floor(session.duration / 60)} minutes
              </span>
            </div>
            <input
              type="text"
              value={session.description || ''}
              onChange={(e) => onDescriptionUpdate(session.id, e.target.value)}
              placeholder="Add session description..."
              className="w-full bg-white/10 text-white placeholder:text-white/30 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
}