import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFocus } from './useFocusStore';
import { useFullscreen } from './useFullscreen';
import { SunIcon, MoonIcon, MaximizeIcon, MinimizeIcon, XIcon, PlayIcon, PauseIcon } from './V2Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { playCompletionTone } from './V2Sound';
import './v2.css';

const V2Timer = () => {
  const navigate = useNavigate();
  const { activeSession, tick, togglePause, endSession, theme, toggleTheme, settings } = useFocus();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [toggleFullscreen]);


  const isLedFont = settings.fontFamily === 'DSEG14';

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

  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    if (activeSession?.status === 'completed') {
      playCompletionTone();
      endSession(true);
      navigate('/');
    }
  }, [activeSession?.status, endSession, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDocked(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const [ms, setMs] = useState(99);

  useEffect(() => {
    if (activeSession?.status !== 'running' || !settings.showMilliseconds) return;
    
    setMs(99);
    const startTime = Date.now();
    let animationFrameId;

    const loop = () => {
      const elapsed = Date.now() - startTime;
      let nextMs = Math.floor((1000 - elapsed) / 10);
      if (nextMs < 0) nextMs = 0;
      setMs(nextMs);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeSession?.remaining, activeSession?.status, settings.showMilliseconds]);

  if (!activeSession) return null;

  const handleEndEarly = () => {
    endSession(false);
    navigate('/');
  };

  const hours = Math.floor(activeSession.remaining / 3600);
  const minutes = Math.floor((activeSession.remaining % 3600) / 60);
  const seconds = activeSession.remaining % 60;

  const progress = ((activeSession.duration - activeSession.remaining) / activeSession.duration) * 100;

  return (
    <div className="v2-container active-timer-view">
      {/* Distraction-free header for controls ... */}
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
              <div className="display-lg" style={{ 
                color: activeSession.status === 'paused' ? 'var(--on-surface-variant)' : 'var(--on-surface)',
                fontSize: isLedFont ? 'clamp(4rem, 12vw, 7rem)' : undefined,
                letterSpacing: isLedFont ? '0.1em' : undefined,
                fontVariantNumeric: 'tabular-nums',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.1em'
              }}>
                {hours > 0 && (
                  <>
                    <span>{hours.toString().padStart(2, '0')}</span>
                    <span style={{ opacity: 0.3, alignSelf: 'center' }}>:</span>
                  </>
                )}
                <span>{minutes.toString().padStart(2, '0')}</span>
                {settings.showMilliseconds ? (
                  <>
                    <span style={{ opacity: 0.3, alignSelf: 'center' }}>:</span>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span style={{ visibility: 'hidden' }}>00</span>
                      <AnimatePresence>
                        <motion.span
                          key={seconds}
                          initial={{ y: '50%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          exit={{ y: '-50%', opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ position: 'absolute', left: 0, top: 0, width: '100%', textAlign: 'center' }}
                        >
                          {seconds.toString().padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span style={{ opacity: 0.3 }}>.</span>
                    <span style={{ fontSize: '0.4em', opacity: 0.6 }}>
                      {ms.toString().padStart(2, '0')}
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ opacity: 0.3, alignSelf: 'center' }}>:</span>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span style={{ visibility: 'hidden' }}>00</span>
                      <AnimatePresence>
                        <motion.span
                          key={seconds}
                          initial={{ y: '50%', opacity: 0 }}
                          animate={{ y: '0%', opacity: 1 }}
                          exit={{ y: '-50%', opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ position: 'absolute', left: 0, top: 0, width: '100%', textAlign: 'center' }}
                        >
                          {seconds.toString().padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
              <p className="label-md" style={{ marginTop: 'var(--spacing-4)', opacity: 0.5 }}>
                {activeSession.status === 'paused' ? 'Paused' : 'Remaining'}
              </p>
            </div>
          </header>

          <AnimatePresence>
            {!showConfirm && (
              <motion.div
                initial={{ opacity: 0, y: '-25vh', x: '-50%' }}
                animate={{ 
                  opacity: 1, 
                  x: isDocked ? 'calc(50vw - 100% - var(--spacing-8))' : '-50%',
                  y: isDocked ? 0 : '-25vh',
                }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ 
                  type: 'spring', 
                  damping: 30, 
                  stiffness: 120,
                  mass: 0.8
                }}
                style={{ 
                  position: 'fixed',
                  bottom: 'var(--spacing-8)',
                  left: '50%',
                  zIndex: 1000, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-4)',
                  padding: 'var(--spacing-4)',
                  background: 'var(--surface-container-low)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: isDocked ? '0 20px 50px rgba(0,0,0,0.1)' : '0 40px 100px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--outline-variant)',
                  width: '320px',
                  maxWidth: 'calc(100vw - 2rem)',
                }}
              >
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                  <button className="btn-ghost d-flex align-items-center" style={{ padding: '0.75rem 1rem', gap: '0.5rem', fontSize: '0.85rem' }} onClick={() => setShowConfirm(true)}>
                    <XIcon size={16} />
                    <span className="label-hide-mobile">/ End</span>
                  </button>
                  <button className="btn-primary d-flex align-items-center" style={{ padding: '0.75rem 2rem', gap: '0.75rem', fontSize: '0.85rem', flex: 1, justifyContent: 'center' }} onClick={togglePause}>
                    {activeSession.status === 'paused' ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
                    <span>{activeSession.status === 'paused' ? 'Resume' : 'Pause'}</span>
                  </button>
                </div>
                <div className="progress-container" style={{ margin: 0, height: '4px', width: '100%' }}>
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default V2Timer;
