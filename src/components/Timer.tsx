import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Dumbbell, Palette } from 'lucide-react';
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
  const hasPlayedStartSound = useRef<boolean>(false);
  const isAudioFinished = useRef<boolean>(false); // Track if audio has finished playing

  useEffect(() => {
    tickSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/start.mp3`);
    endSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/end.mp3`);
    pauseStartSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/pausestart.mp3`);
    pauseEndSoundRef.current = new Audio(`${import.meta.env.BASE_URL}sounds/pauseend.mp3`);

    // Add event listener to detect when audio finishes playing
    if (tickSoundRef.current) {
      tickSoundRef.current.addEventListener('ended', () => {
        isAudioFinished.current = true;
      });
    }
    if (pauseStartSoundRef.current) {
      pauseStartSoundRef.current.addEventListener('ended', () => {
        isAudioFinished.current = true;
      });
    }
  }, []);

  const [state, setState] = useState<TimerState>({
    minutes: Math.floor(workDuration / 60),
    seconds: 0,
    isRunning: false,
    type: 'work',
    isPaused: false
  });

  // Update timer when duration changes
  useEffect(() => {
    if (!state.isRunning && !state.isPaused) {
      const duration = state.type === 'work' ? workDuration : breakDuration;
      setState(prev => ({
        ...prev,
        minutes: Math.floor(duration / 60),
        seconds: 0
      }));
    }
  }, [workDuration, breakDuration, state.type, state.isRunning, state.isPaused]);

  const toggleTimer = () => {
    if (state.isRunning) {
      // Pause the timer and audio
      if (tickSoundRef.current && !tickSoundRef.current.paused && !isAudioFinished.current) {
        tickSoundRef.current.pause();
      }
      if (pauseStartSoundRef.current && !pauseStartSoundRef.current.paused && !isAudioFinished.current) {
        pauseStartSoundRef.current.pause();
      }
      setState(prev => ({ ...prev, isRunning: false, isPaused: true }));
    } else {
      // Resume or start the timer
      if (!hasPlayedStartSound.current) {
        if (state.type === 'work' && tickSoundRef.current) {
          tickSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
          hasPlayedStartSound.current = true;
          isAudioFinished.current = false; // Reset audio finished flag
        } else if (state.type === 'break' && pauseStartSoundRef.current) {
          pauseStartSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
          hasPlayedStartSound.current = true;
          isAudioFinished.current = false; // Reset audio finished flag
        }
      } else if (!isAudioFinished.current) {
        // Resume audio from where it was paused
        if (state.type === 'work' && tickSoundRef.current) {
          tickSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
        } else if (state.type === 'break' && pauseStartSoundRef.current) {
          pauseStartSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
        }
      }
      setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    }
  };

  const resetTimer = (type: 'work' | 'break') => {
    const duration = type === 'work' ? workDuration : breakDuration;
    hasPlayedStartSound.current = false; // Reset the audio flag on reset
    isAudioFinished.current = false; // Reset audio finished flag
    setState({
      minutes: Math.floor(duration / 60),
      seconds: 0,
      isRunning: false,
      type: type,
      isPaused: false
    });
    // Stop any playing audio on reset
    if (tickSoundRef.current) {
      tickSoundRef.current.pause();
      tickSoundRef.current.currentTime = 0;
    }
    if (pauseStartSoundRef.current) {
      pauseStartSoundRef.current.pause();
      pauseStartSoundRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let sessionCompleted = false;

    if (state.isRunning) {
      interval = setInterval(() => {
        setState(prev => {
          const totalSeconds = prev.minutes * 60 + prev.seconds;
          
          // Play end sound when 10 seconds remain
          if (totalSeconds === 10 && !sessionCompleted) {
            if (endSoundRef.current) {
              endSoundRef.current.play().catch(err => console.log('Audio play failed:', err));
            }
          }

          if (totalSeconds === 0 && !sessionCompleted) {
            sessionCompleted = true;
            const duration = prev.type === 'work' ? workDuration : breakDuration;
            onSessionComplete(duration, prev.type);
            const nextType = prev.type === 'work' ? 'break' : 'work';
            const nextDuration = nextType === 'work' ? workDuration : breakDuration;
            hasPlayedStartSound.current = false; // Reset the audio flag when the session completes
            isAudioFinished.current = false; // Reset audio finished flag
            return {
              minutes: Math.floor(nextDuration / 60),
              seconds: 0,
              isRunning: false,
              type: nextType,
              isPaused: false
            };
          }

          if (sessionCompleted) {
            return prev;
          }

          const newTotalSeconds = totalSeconds - 1;
          return {
            ...prev,
            minutes: Math.floor(newTotalSeconds / 60),
            seconds: newTotalSeconds % 60
          };
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
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
            {state.type === 'work' ? <Dumbbell size={24} /> : <Coffee size={24} />}
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