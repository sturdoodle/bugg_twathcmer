import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './v2.css';
import { useFocus } from './useFocusStore';
import { useFullscreen } from './useFullscreen';
import { SunIcon, MoonIcon, MaximizeIcon, MinimizeIcon, SettingsIcon, PlayIcon, TrashIcon } from './V2Icons';
import { unlockAudio } from './V2Sound';
import V2Settings from './V2Settings';

const V2Main = () => {
  const navigate = useNavigate();
  const { settings, history, startSession, theme, toggleTheme, clearHistory } = useFocus();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [selectedType, setSelectedType] = useState('pomodoro');
  const [showSettings, setShowSettings] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  const timerOptions = [
    { id: 'pomodoro', title: 'Pomodoro', duration: settings.pomodoro, label: 'Classic Focus', description: 'Optimal for sustained concentration.' },
    { id: 'shortBreak', title: 'Short Break', duration: settings.shortBreak, label: 'Best for Rest', description: 'A quick breather to recharge.' },
    { id: 'longBreak', title: 'Long Break', duration: settings.longBreak, label: 'Deep Recharge', description: 'Standard interval for longer rests.' },
    { id: 'deepWork', title: 'Deep Work', duration: settings.deepWork, label: 'Most Productive', description: 'Uninterrupted flow state session.', premium: true },
  ];

  const handleStart = () => {
    unlockAudio();
    const option = timerOptions.find(o => o.id === selectedType);
    startSession(selectedType, option.duration);
    navigate('/timer');
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="v2-container">
      <header className="v2-header">
        <div>
          <h1 className="display-md">Focus</h1>
          <p className="label-md" style={{ letterSpacing: '0.4em', marginTop: '0.5rem' }}>QPkendra</p>
        </div>
        <div className="v2-controls">
          <button className="btn-ghost d-flex align-items-center" onClick={toggleTheme} style={{ gap: '0.5rem' }}>
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            <span className="label-hide-mobile">/ {theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <button className="btn-ghost d-flex align-items-center" onClick={toggleFullscreen} style={{ gap: '0.5rem' }}>
            {isFullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
            <span className="label-hide-mobile">/ {isFullscreen ? 'Normal' : 'Full'}</span>
          </button>
          <button className="btn-ghost d-flex align-items-center" onClick={() => setShowSettings(true)} style={{ gap: '0.5rem' }}>
            <SettingsIcon size={18} />
            <span className="label-hide-mobile">/ Settings</span>
          </button>
        </div>
      </header>

      <main className="v2-main">
        <section className="timer-selection">
          {timerOptions.map((option) => (
            <div
              key={option.id}
              className={`card-selection ${selectedType === option.id ? 'selected' : ''}`}
              onClick={() => setSelectedType(option.id)}
            >
              {option.premium ? (
                <span className="badge-chip">Most Productive</span>
              ) : (
                selectedType === option.id && <span className="badge-chip">Active</span>
              )}

              <div>
                <h2 className="title-lg" style={{ marginBottom: '0.25rem' }}>{option.title}</h2>
                <p className="label-md" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{option.duration}m</p>
              </div>

              <p className="body-md text-variant" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                {option.description}
              </p>
            </div>
          ))}
        </section>

        <div style={{ marginTop: 'var(--spacing-16)', textAlign: 'center' }}>
          <button className="btn-primary d-inline-flex align-items-center" onClick={handleStart} style={{ gap: '0.75rem' }}>
            <PlayIcon size={20} />
            <span>Start {timerOptions.find(o => o.id === selectedType).title}</span>
          </button>
        </div>

        {history.length > 0 && (
          <section className="history-section">
            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 className="label-md" style={{ marginBottom: 0, opacity: 0.8 }}>Log / Recent Activity</h3>
              <button
                className="btn-ghost d-flex align-items-center"
                onClick={() => {
                  if (isClearing) {
                    clearHistory();
                    setIsClearing(false);
                  } else {
                    setIsClearing(true);
                  }
                }}
                onMouseLeave={() => setIsClearing(false)}
                style={{ gap: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
              >
                <TrashIcon size={14} />
                <span className="label-hide-mobile">{isClearing ? 'Confirm Clear?' : 'Clear History'}</span>
                {isClearing && <span className="d-flex d-md-none" style={{ fontSize: '0.65rem' }}>Confirm?</span>}
              </button>
            </div>
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-card">
                  <div>
                    <span className="title-md" style={{ textTransform: 'capitalize', fontSize: '1rem' }}>{item.type}</span>
                    <p className="label-md" style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.5 }}>{formatDate(item.startTime)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="label-md" style={{
                      fontSize: '0.7rem',
                      color: item.status === 'completed' ? 'var(--primary)' : 'inherit',
                      opacity: item.status === 'completed' ? 1 : 0.4
                    }}>
                      {item.status === 'completed' ? 'Success' : 'Incomplete'}
                    </span>
                    <p className="title-md" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      {Math.floor(item.actualDuration / 60)}m {item.actualDuration % 60}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showSettings && <V2Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default V2Main;
