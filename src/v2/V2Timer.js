import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFocus } from './useFocusStore';
import { useFullscreen } from './useFullscreen';
import { SunIcon, MoonIcon, MaximizeIcon, MinimizeIcon, PlayIcon, PauseIcon } from './V2Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { playCompletionTone } from './V2Sound';
import './v2.css';


const V2Timer = () => {
  const navigate = useNavigate();
  const { activeSession, tick, togglePause, endSession, theme, toggleTheme, settings } = useFocus();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [showConfirm, setShowConfirm] = useState(false);


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
  const [isDimmed, setIsDimmed] = useState(false);
  const [isLabelsDimmed, setIsLabelsDimmed] = useState(false);

  // Auto-dim logic: labels dim almost instantly (200ms), controls dim after 20s
  useEffect(() => {
    let dimTimer = setTimeout(() => setIsDimmed(true), 10000);
    let labelTimer = setTimeout(() => setIsLabelsDimmed(true), 200);

    const wake = () => {
      setIsDimmed(false);
      setIsLabelsDimmed(false);
      clearTimeout(dimTimer);
      clearTimeout(labelTimer);
      dimTimer = setTimeout(() => setIsDimmed(true), 10000);
      labelTimer = setTimeout(() => setIsLabelsDimmed(true), 200);
    };

    window.addEventListener('mousemove', wake);
    window.addEventListener('mousedown', wake);
    window.addEventListener('touchstart', wake);
    window.addEventListener('keydown', wake);

    return () => {
      clearTimeout(dimTimer);
      clearTimeout(labelTimer);
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('mousedown', wake);
      window.removeEventListener('touchstart', wake);
      window.removeEventListener('keydown', wake);
    };
  }, []);

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

  // Keep screen awake while timer is actively running
  useEffect(() => {
    if (!('wakeLock' in navigator)) return;
    let wakeLock = null;

    const acquire = async () => {
      try { wakeLock = await navigator.wakeLock.request('screen'); } catch (_) { }
    };
    const release = () => {
      if (wakeLock) { wakeLock.release(); wakeLock = null; }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeSession?.status === 'running') acquire();
      else release();
    };

    if (activeSession?.status === 'running') acquire();
    else release();

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      release();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [activeSession?.status]);

  const timerRef = useRef(null);

  const [timerBottom, setTimerBottom] = useState(null);

  // Track the bottom edge of the timer hero so the pill sits below it
  useEffect(() => {
    const el = timerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setTimerBottom(rect.bottom);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
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

  const fontValue = settings.fontFamily === 'DSEG14' ? "'DSEG14', monospace" : `'${settings.fontFamily}', sans-serif`;

  return (
    <div className="v2-container active-timer-view" style={{ '--app-font': fontValue }}>
      {/* Distraction-free header for controls ... */}
      {!showConfirm && (
        <motion.header
          className="v2-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDimmed ? 0.2 : 1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 'var(--spacing-8)', left: 'var(--spacing-6)', right: 'var(--spacing-6)', marginBottom: 0 }}
        >
          <div />
          <div className="v2-controls">
            <button className="btn-ghost d-flex align-items-center" onClick={toggleTheme} style={{ gap: '0.5rem' }}>
              {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
              <span className="label-hide-mobile"> {theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button className="btn-ghost d-flex align-items-center" onClick={toggleFullscreen} style={{ gap: '0.5rem' }}>
              {isFullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
              <span className="label-hide-mobile"> {isFullscreen ? 'Normal' : 'Full'}</span>
            </button>
          </div>
        </motion.header>
      )}

      {showConfirm ? (
        <div className="confirm-overlay" style={{ '--app-font': "'Outfit', sans-serif" }}>
          <h2 className="title-lg" style={{ marginBottom: 'clamp(0.5rem, 2vh, 1rem)', fontSize: 'clamp(1rem, min(4vw, 4vh), 1.5rem)' }}>End this session?</h2>
          <p className="body-md text-variant" style={{ marginBottom: 'clamp(1rem, 4vh, 2.5rem)', fontSize: 'clamp(0.75rem, min(3vw, 2.5vh), 1rem)', textAlign: 'center', maxWidth: '90%' }}>
            We'll record your progress so far, but the task will be marked incomplete.
          </p>
          <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', width: '100%', maxWidth: 'min(320px, 90vw)' }}>
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: 'clamp(0.6rem, 2vh, 1rem) clamp(0.75rem, 3vw, 2.5rem)', fontSize: 'clamp(0.75rem, min(3vw, 2.5vh), 1rem)', whiteSpace: 'nowrap' }}
              onClick={() => setShowConfirm(false)}
            >
              Keep Going
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1, padding: 'clamp(0.6rem, 2vh, 1.25rem) clamp(0.75rem, 3vw, 3.5rem)', fontSize: 'clamp(0.75rem, min(3vw, 2.5vh), 1.1rem)', whiteSpace: 'nowrap' }}
              onClick={handleEndEarly}
            >
              End Early
            </button>
          </div>
        </div>

      ) : (
        <>
          <header className="timer-hero" ref={timerRef}>
            <motion.h1
              className="label-md timer-type-label"
              animate={{ opacity: isLabelsDimmed ? 0.05 : 1 }}
              transition={{ duration: 0.8 }}
            >
              QPKENDRA
            </motion.h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="display-lg" style={{
                color: activeSession.status === 'paused' ? 'var(--on-surface-variant)' : 'var(--on-surface)',
                fontSize: isLedFont ? 'clamp(2.5rem, min(12vw, 18vh), 7rem)' : undefined,
                letterSpacing: isLedFont ? '0.1em' : undefined,
                fontStyle: isLedFont ? 'italic' : 'normal',
                fontVariantNumeric: 'tabular-nums',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.05em'
              }}>
                {/* Reusable Digit Segment Animation */}
                {(() => {
                  const renderSegment = (value, key) => (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <span style={{ visibility: 'hidden' }}>00</span>
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={value}
                          initial={{ y: '25%', opacity: 0, filter: 'blur(8px)' }}
                          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                          exit={{ y: '-25%', opacity: 0, filter: 'blur(8px)' }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 28,
                            mass: 0.5,
                            opacity: { duration: 0.2 }
                          }}
                          style={{ position: 'absolute', left: 0, top: 0, width: '100%', textAlign: 'center' }}
                        >
                          {value.toString().padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  );

                  return (
                    <>
                      {hours > 0 && (
                        <>
                          {renderSegment(hours, 'hours')}
                          <span style={{ opacity: 0.3, alignSelf: 'center', margin: '0 -0.05em' }}>:</span>
                        </>
                      )}
                      {renderSegment(minutes, 'minutes')}
                      <span style={{ opacity: 0.3, alignSelf: 'center', margin: '0 -0.05em' }}>:</span>
                      {renderSegment(seconds, 'seconds')}

                      {settings.showMilliseconds && (
                        <>
                          <span style={{ opacity: 0.3, margin: '0 0.05em' }}>.</span>
                          <span style={{ fontSize: '0.45em', opacity: 0.6, width: '1.2em', textAlign: 'left' }}>
                            {ms.toString().padStart(2, '0')}
                          </span>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
              <motion.p
                className="label-md"
                animate={{ opacity: isLabelsDimmed ? 0.05 : 1 }}
                transition={{ duration: 0.8 }}
                style={{ marginTop: 'clamp(0.25rem, 1.5vh, var(--spacing-4))', fontSize: 'clamp(0.6rem, min(2vw, 1.8vh), 0.8rem)' }}
              >
                {activeSession.status === 'paused' ? 'Paused' : 'Remaining'}
              </motion.p>
            </div>
          </header>

          <AnimatePresence>
            {!showConfirm && (
              <motion.div
                initial={{ opacity: 0, x: '-50%' }}
                animate={{
                  opacity: isDimmed ? 0.05 : 1,
                  x: isDocked ? 'calc(50vw - 100% - var(--spacing-8))' : '-50%',
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 120,
                  mass: 0.8,
                  opacity: { duration: 0.8, ease: 'easeInOut' },
                }}
                style={{
                  position: 'fixed',
                  // Centered: sit 20px below the timer; Docked: snap to bottom edge
                  top: isDocked ? 'auto' : (timerBottom != null ? `${timerBottom + 20}px` : '65vh'),
                  bottom: isDocked ? 'var(--spacing-8)' : 'auto',
                  left: '50%',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '10px',
                  width: 'min(300px, 45vw, 35vh)',
                  maxWidth: 'calc(100vw - 2rem)',
                }}
              >
                {/* Split-pill: left = Stop, right = Pause */}
                <div style={{
                  display: 'flex',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  boxShadow: isDocked ? '0 20px 50px rgba(0,0,0,0.12)' : '0 40px 100px rgba(0,0,0,0.18)',
                  border: '1px solid var(--outline-variant)',
                  backdropFilter: 'blur(10px)',
                }}>
                  {/* Left half — Stop */}
                  <button
                    onClick={() => setShowConfirm(true)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(0.2rem, min(1vw, 1.8vh), 0.45rem)',
                      padding: 'clamp(0.4rem, min(2vw, 3vh), 0.8rem) clamp(0.35rem, min(1.5vw, 2.5vh), 1rem)',
                      background: 'var(--surface-container-low)',
                      color: 'var(--on-surface)',
                      border: 'none',
                      borderRight: '1px solid var(--outline-variant)',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.55rem, min(2.2vw, 3.5vh), 0.82rem)',
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      backdropFilter: 'blur(10px)',
                      transition: 'background 0.2s',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                  >
                    {/* <XIcon size={12} /> */}
                    <span>X | End</span>
                  </button>

                  {/* Right half — Pause / Resume */}
                  <button
                    onClick={togglePause}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'clamp(0.2rem, min(1vw, 1.8vh), 0.5rem)',
                      padding: 'clamp(0.4rem, min(2vw, 3vh), 0.8rem) clamp(0.35rem, min(1.5vw, 2.5vh), 1rem)',
                      background: 'var(--primary)',
                      color: 'var(--on-primary)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.55rem, min(2.2vw, 3.5vh), 0.82rem)',
                      fontWeight: 700,
                      fontFamily: 'var(--font-body)',
                      transition: 'filter 0.2s',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.12)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    {activeSession.status === 'paused' ? <PlayIcon size="clamp(16px, 4vw, 22px)" /> : <PauseIcon size="clamp(16px, 4vw, 22px)" />}
                    <span>{activeSession.status === 'paused' ? 'Resume' : 'Pause'}</span>
                  </button>
                </div>

                {/* Progress bar — below the pill */}
                <div style={{
                  width: '100%',
                  height: '3px',
                  background: 'var(--surface-container-high)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-container))',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 1s linear',
                  }} />
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
