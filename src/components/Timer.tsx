import React, { useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Dumbbell, Palette } from 'lucide-react';
import { TimerState } from '../types';
import { getRandomGradient } from '../utils/gradients';

const tickSound = new Audio('./sounds/tick.mp3');
const endSound = new Audio('./sounds/end.mp3');

interface TimerProps {
  onSessionComplete: (duration: number, type: 'work' | 'break') => void;
  onGradientChange: (gradient: string) => void;
  workDuration: number;
  breakDuration: number;
}

export default function Timer({ 
  onSessionComplete, 
  onGradientChange,
  workDuration,
  breakDuration 
}: TimerProps) {
  const [state, setState] = useState<TimerState>({
    minutes: Math.floor(workDuration / 60),
    seconds: 0,
    isRunning: false,
    type: 'work'
  });



  const resetTimer = useCallback((type: 'work' | 'break' = 'work') => {
    const totalSeconds = type === 'work' ? workDuration : breakDuration;
    setState({
      minutes: Math.floor(totalSeconds / 60),
      seconds: 0,
      isRunning: false,
      type
    });
  }, [workDuration, breakDuration]);

  useEffect(() => {
    resetTimer(state.type);
  }, [workDuration, breakDuration, state.type, resetTimer]);

  const toggleTimer = () => {
    if (!state.isRunning) {
      tickSound.play();
    }
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

    // Update document title with timer
    useEffect(() => {
      const timeString = `${String(state.minutes).padStart(2, '0')}:${String(state.seconds).padStart(2, '0')}`;
      document.title = state.isRunning ? `${timeString} - ${state.type === 'work' ? 'Working' : 'Break'} - Pomodoro` : 'Pomodoro Timer';
    }, [state.minutes, state.seconds, state.isRunning, state.type]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let sessionCompleted = false;

    if (state.isRunning) {
      interval = setInterval(() => {
        setState(prev => {
          if (prev.minutes === 0 && prev.seconds === 6 && !sessionCompleted) {
            endSound.play();
          }
          if (prev.minutes === 0 && prev.seconds === 0 && !sessionCompleted) {
            sessionCompleted = true;
            const duration = prev.type === 'work' ? workDuration : breakDuration;
            onSessionComplete(duration, prev.type);
            const nextType = prev.type === 'work' ? 'break' : 'work';
            const nextDuration = nextType === 'work' ? workDuration : breakDuration;
            return {
              minutes: Math.floor(nextDuration / 60),
              seconds: 0,
              isRunning: false,
              type: nextType
            };
          }

          if (sessionCompleted) {
            return prev;
          }

          const totalSeconds = prev.minutes * 60 + prev.seconds - 1;
          return {
            ...prev,
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60
          };
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      sessionCompleted = false;
    };
  }, [state.isRunning, onSessionComplete, workDuration, breakDuration]);

  const timerScale = state.isRunning ? 'scale-125' : 'scale-100';
  const controlsScale = state.isRunning ? 'scale-90' : 'scale-100';

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className={`text-8xl font-bold tracking-widest transition-transform duration-500 ${timerScale}`}>
        {String(state.minutes).padStart(2, '0')}:
        {String(state.seconds).padStart(2, '0')}
      </div>
      
      <div className={`flex flex-col items-center space-y-4 transition-transform duration-500 ${controlsScale}`}>
        <div className="flex space-x-4">
          <button
            onClick={toggleTimer}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
            title={state.isRunning ? "Pause timer" : "Start timer"}
          >
            {state.isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={() => resetTimer(state.type)}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
            title="Reset timer"
          >
            <RotateCcw size={24} />
          </button>
          
          <button
            onClick={() => resetTimer(state.type === 'work' ? 'break' : 'work')}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
            title={state.type === 'work' ? "Switch to break" : "Switch to work"}
          >
            {state.type === 'work' ? <Coffee size={24} /> : <Dumbbell size={24} />}
          </button>

          <button
            onClick={() => onGradientChange(getRandomGradient)}
            className="bg-white/20 hover:bg-white/30 p-4 rounded-full transition-all"
            title="Change background color"
          >
            <Palette size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}