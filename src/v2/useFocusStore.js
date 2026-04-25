import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DEFAULT_SETTINGS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  deepWork: 65,
  fontFamily: 'Outfit',
  showMilliseconds: false,
};

const FocusContext = createContext();

export const FocusProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('v2_focus_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('v2_focus_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSession, setActiveSession] = useState(null);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('v2_focus_theme');
    return saved || 'light';
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('v2_focus_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('v2_focus_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('v2_focus_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Apply Font
  useEffect(() => {
    const fontValue = settings.fontFamily === 'DSEG14' ? "'DSEG14', monospace" : `'${settings.fontFamily}', sans-serif`;
    document.documentElement.style.setProperty('--app-font', fontValue);
  }, [settings.fontFamily]);

  // Title update logic
  useEffect(() => {
    if (!activeSession) {
      document.title = 'Focus / QPkendra';
      return;
    }

    if (activeSession.status === 'paused') {
      document.title = `Paused - Focus`;
      return;
    }

    const h = Math.floor(activeSession.remaining / 3600);
    const m = Math.floor((activeSession.remaining % 3600) / 60);
    const s = activeSession.remaining % 60;
    
    const timeStr = h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    document.title = `[${timeStr}] Focus`;

    // Cleanup title on session completion/end
    return () => {
      document.title = 'Focus / QPkendra';
    };
  }, [activeSession]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const startSession = (type, durationMinutes) => {
    const startTime = new Date().toISOString();
    setActiveSession({
      type,
      duration: durationMinutes * 60,
      remaining: durationMinutes * 60,
      startTime,
      status: 'running',
    });
  };

  const endSession = useCallback((completed = true) => {
    setActiveSession((current) => {
      if (!current) return null;

      const endTime = new Date().toISOString();
      const newEntry = {
        ...current,
        endTime,
        status: completed ? 'completed' : 'ended_early',
        actualDuration: current.duration - current.remaining,
      };

      setHistory((prev) => [newEntry, ...prev].slice(0, 50));
      return null;
    });
  }, []);

  const tick = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev || prev.status !== 'running') return prev;
      if (prev.remaining <= 1) {
        return { ...prev, remaining: 0, status: 'completed' };
      }
      return { ...prev, remaining: prev.remaining - 1 };
    });
  }, []);

  const togglePause = () => {
    setActiveSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: prev.status === 'running' ? 'paused' : 'running',
      };
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const value = {
    settings,
    updateSettings,
    history,
    activeSession,
    startSession,
    endSession,
    togglePause,
    tick,
    theme,
    toggleTheme,
    clearHistory,
  };

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

export default FocusProvider;
