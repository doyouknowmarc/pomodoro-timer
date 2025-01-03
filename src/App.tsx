import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import History from './components/History';
import SessionForm from './components/SessionForm';
import Settings from './components/Settings';
import { PomodoroSession, ThemeSettings } from './types';
import { gradients } from './utils/gradients';

function App() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [currentGradient, setCurrentGradient] = useState(gradients[0]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [workDuration, setWorkDuration] = useState(45 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [settings, setSettings] = useState<ThemeSettings>({
    useGradient: true,
    backgroundColor: '#000000',
    textColor: '#ffffff',
    gradientAnimationDuration: 15,
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--gradient-animation-duration',
      `${settings.gradientAnimationDuration}s`
    );
  }, [settings.gradientAnimationDuration]);

  const handleSessionComplete = (duration: number, type: 'work' | 'break') => {
    const newSession: PomodoroSession = {
      id: Date.now().toString(),
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date(),
      duration,
      type,
      completed: true,
      description: currentDescription,
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentDescription('');
  };

  const handleDescriptionUpdate = (id: string, description: string) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, description } : session
    ));
  };

  const getBackgroundClass = () => {
    if (settings.useGradient) {
      return `bg-gradient-to-br ${currentGradient} animate-gradient`;
    }
    return '';
  };

  const getStyles = () => ({
    backgroundColor: settings.useGradient ? undefined : settings.backgroundColor,
    color: settings.textColor,
  });

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-8 space-y-12 transition-colors duration-1000 ${getBackgroundClass()}`}
      style={getStyles()}
    >
      <div className="flex flex-col items-center space-y-6">
        <SessionForm 
          description={currentDescription}
          onDescriptionChange={setCurrentDescription}
        />
        <Timer 
          onSessionComplete={handleSessionComplete} 
          onGradientChange={setCurrentGradient}
          workDuration={workDuration}
          breakDuration={breakDuration}
        />
      </div>
      <History 
        sessions={sessions}
        onDescriptionUpdate={handleDescriptionUpdate}
      />
      <Settings
        settings={settings}
        onSettingsChange={setSettings}
        workDuration={workDuration}
        breakDuration={breakDuration}
        onWorkDurationChange={setWorkDuration}
        onBreakDurationChange={setBreakDuration}
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
      />
    </div>
  );
}

export default App;