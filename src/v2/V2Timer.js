import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFocus } from './useFocusStore';
import { useFullscreen } from './useFullscreen';
import { SunIcon, MoonIcon, MaximizeIcon, MinimizeIcon, XIcon, PlayIcon, PauseIcon } from './V2Icons';
import { playCompletionTone } from './V2Sound';
import './v2.css';

const V2Timer = () => {
  const navigate = useNavigate();
  const { activeSession, tick, togglePause, endSession, theme, toggleTheme } = useFocus();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!activeSession) {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      if (activeSession.status === 'running') {
        tick();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, tick, navigate]);

  useEffect(() => {
    if (activeSession?.status === 'completed') {
      playCompletionTone();
      endSession(true);
      navigate('/');
    }
  }, [activeSession?.status, endSession, navigate]);

  if (!activeSession) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndEarly = () => {
    endSession(false);
    navigate('/');
  };

  const progress = ((activeSession.duration - activeSession.remaining) / activeSession.duration) * 100;

  return (
    <div className="v2-container active-timer-view">
      {/* Distraction-free header for controls */}
      {!showConfirm && (
        <header className="v2-header" style={{ position: 'absolute', top: 'var(--spacing-8)', left: 'var(--spacing-6)', right: 'var(--spacing-6)', marginBottom: 0 }}>
          <div />
          <div className="v2-controls">
            <button className="btn-ghost d-flex align-items-center" onClick={toggleTheme} style={{ gap: '0.5rem' }}>
              {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
              <span className="label-hide-mobile">/ {theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button className="btn-ghost d-flex align-items-center" onClick={toggleFullscreen} style={{ gap: '0.5rem' }}>
              {isFullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
              <span className="label-hide-mobile">/ {isFullscreen ? 'Normal' : 'Full'}</span>
            </button>
          </div>
        </header>
      )}

      {showConfirm ? (
        <div className="confirm-overlay">
          <h2 className="title-lg" style={{ marginBottom: '1rem' }}>End this session?</h2>
          <p className="body-md text-variant" style={{ marginBottom: '2.5rem' }}>
            We'll record your progress so far, but the task will be marked incomplete.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', width: '100%', maxWidth: '320px' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>
              Keep Going
            </button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleEndEarly}>
              End Early
            </button>
          </div>
        </div>
      ) : (
        <>
          <header className="timer-hero">
            <h1 className="label-md timer-type-label">
              {activeSession.type.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="display-lg" style={{ color: activeSession.status === 'paused' ? 'var(--on-surface-variant)' : 'var(--on-surface)' }}>
                {formatTime(activeSession.remaining)}
              </span>
              <p className="label-md" style={{ marginTop: 'var(--spacing-4)', opacity: 0.5 }}>
                {activeSession.status === 'paused' ? 'Paused' : 'Remaining'}
              </p>
            </div>
          </header>

          <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-12)' }}>
            <button className="btn-ghost d-flex align-items-center" style={{ padding: '1rem 2rem', gap: '0.5rem' }} onClick={() => setShowConfirm(true)}>
              <XIcon size={18} />
              <span>/ End Early</span>
            </button>
            <button className="btn-primary d-flex align-items-center" style={{ padding: '1rem 3.5rem', gap: '0.75rem' }} onClick={togglePause}>
              {activeSession.status === 'paused' ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
              <span>{activeSession.status === 'paused' ? 'Resume Session' : 'Pause Session'}</span>
            </button>
          </div>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}
    </div>
  );
};

export default V2Timer;
