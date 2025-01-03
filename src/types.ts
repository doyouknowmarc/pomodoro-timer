export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: 'work' | 'break';
  completed: boolean;
  description?: string;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  type: 'work' | 'break';
}

export interface ThemeSettings {
  useGradient: boolean;
  backgroundColor: string;
  textColor: string;
  gradientAnimationDuration: number;
}