import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Palette } from 'lucide-react';
import { TimerState } from '../types';
import { getRandomGradient } from '../utils/gradients';

export default function Timer({ 
  onSessionComplete, 
  onGradientChange,
  workDuration,
  breakDuration 
}: TimerProps) {
  const tickSoundRef = useRef<HTMLAudioElement | null>(null);
  const endSoundRef = useRef<HTMLAudioElement | null>(null);
  const pauseStartSoundRef = useRef<HTMLAudioElement | null>(null);
  const pauseEndSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/start.mp3`);
    endSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/end.mp3`);
    pauseStartSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/pausestart.mp3`);
    pauseEndSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/pauseend.mp3`);
  }, []);

  const [state, setState] = useState<TimerState>({
    minutes: Math.floor(workDuration / 60),
    seconds: 0,
    isRunning: false,
    type: 'work',
  });

  const toggleTimer = () => {
    if (!state.isRunning && tickSoundRef.current) {
      tickSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
    if (state.isRunning && tickSoundRef.current) {
      tickSoundRef.current.pause();
    }
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = (type: 'work' | 'break') => {
    const duration = type === 'work' ? workDuration : breakDuration;
    setState({
      minutes: Math.floor(duration / 60),
      seconds: 0,
      isRunning: false,
      type: type,
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let sessionCompleted = false;
    let pauseEndTimeout: NodeJS.Timeout;

    if (state.isRunning) {
      interval = setInterval(() => {
        setState(prev => {
          if (prev.minutes === 0 && prev.seconds === 6 && !sessionCompleted && endSoundRef.current) {
            endSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
          }

          if (prev.minutes === 0 && prev.seconds === 0 && !sessionCompleted) {
            sessionCompleted = true;
            const duration = prev.type === 'work' ? workDuration : breakDuration;
            onSessionComplete(duration, prev.type);
            const nextType = prev.type === 'work' ? 'break' : 'work';
            const nextDuration = nextType === 'work' ? workDuration : breakDuration;
            if (nextType === 'break' && pauseStartSoundRef.current) {
              pauseStartSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
            }
            return {
              minutes: Math.floor(nextDuration / 60),
              seconds: 0,
              isRunning: false,
              type: nextType,
            };
          }

          if (sessionCompleted) {
            return prev;
          }

          const totalSeconds = prev.minutes * 60 + prev.seconds - 1;
          return {
            ...prev,
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60,
          };
        });
      }, 1000);
    }

    if (state.type === 'break') {
      const totalPauseTime = state.minutes * 60 + state.seconds;
      if (totalPauseTime > 10) {
        pauseEndTimeout = setTimeout(() => {
          if (pauseEndSoundRef.current) {
            pauseEndSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
          }
        }, (totalPauseTime - 10) * 1000);
      }
    }

    return () => {
      clearInterval(interval);
      clearTimeout(pauseEndTimeout);
      sessionCompleted = false;
    };
  }, [state.isRunning, state.type, onSessionComplete, workDuration, breakDuration]);

  useEffect(() => {
    const timeString = `${String(state.minutes).padStart(2, '0')}:${String(state.seconds).padStart(2, '0')}`;
    document.title = state.isRunning ? `${timeString} - ${state.type === 'work' ? 'Working' : 'Break'} - Pomodoro` : 'Pomodoro Timer';
  }, [state.minutes, state.seconds, state.isRunning, state.type]);

  const timerScale = state.isRunning ? 'scale-100' : 'scale-100';
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
            <Coffee size={24} />
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
