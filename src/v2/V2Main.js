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


  const [targetDateTime, setTargetDateTime] = useState('');
  const [goalMessage, setGoalMessage] = useState('');
  
  const milestones = [
    { id: 'birthday', label: 'Birthday 🎂', text: 'Happy Birthday' },
    { id: 'subscriber', label: 'Subscriber 🚀', text: 'New Subscriber Milestone!' },
    { id: 'custom', label: 'Custom ✨', text: '' },
  ];
  const [selectedMilestone, setSelectedMilestone] = useState(milestones[0].id);

  const timerOptions = [
    { id: 'pomodoro', title: 'Pomodoro', duration: settings.pomodoro, label: 'Classic Focus', description: 'Optimal for sustained concentration.' },
    { id: 'shortBreak', title: 'Short Break', duration: settings.shortBreak, label: 'Best for Rest', description: 'A quick breather to recharge.', mostUsed: true },
    { id: 'longBreak', title: 'Long Break', duration: settings.longBreak, label: 'Deep Recharge', description: 'Standard interval for longer rests.' },
    { id: 'deepWork', title: 'Deep Work', duration: settings.deepWork, label: 'Most Productive', description: 'Uninterrupted flow state session.', premium: true },
    { id: 'goal', title: 'Goal', label: 'Countdown', description: 'Track time remaining to a specific future date.', isEvent: true },
  ];

  const handleStart = () => {
    unlockAudio();
    const option = timerOptions.find(o => o.id === selectedType);
    if (selectedType === 'goal') {
      if (!targetDateTime) return;
      const milestone = milestones.find(m => m.id === selectedMilestone);
      const fullMessage = selectedMilestone === 'custom' 
        ? goalMessage 
        : (milestone.text + (goalMessage ? ` ${goalMessage}` : ''));
      
      startSession(selectedType, 0, targetDateTime, fullMessage, selectedMilestone);
    } else {
      startSession(selectedType, option.duration);
    }
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
            <span className="label-hide-mobile"> {theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <button className="btn-ghost d-flex align-items-center" onClick={toggleFullscreen} style={{ gap: '0.5rem' }}>
            {isFullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
            <span className="label-hide-mobile"> {isFullscreen ? 'Normal' : 'Full'}</span>
          </button>
          <button className="btn-ghost d-flex align-items-center" onClick={() => setShowSettings(true)} style={{ gap: '0.5rem' }}>
            <SettingsIcon size={18} />
            <span className="label-hide-mobile"> Settings</span>
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
              {option.premium && <span className="badge-chip">Most Productive</span>}
              {option.mostUsed && <span className="badge-chip" style={{ background: 'var(--secondary)' }}>Most Used</span>}

              <div>
                <h2 className="title-lg" style={{ marginBottom: '0.25rem' }}>{option.title}</h2>
                <p className="label-md" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{option.duration}m</p>
              </div>

              <p className="body-md text-variant" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                {option.description}
              </p>

              {option.isEvent && selectedType === option.id && (
                <div style={{ marginTop: '1.25rem' }}>
                  <label className="label-md" style={{ fontSize: '0.65rem', marginBottom: '0.6rem', display: 'block', opacity: 0.6 }}>Select Milestone</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {milestones.map(m => (
                      <button 
                        key={m.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedMilestone(m.id); }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          background: selectedMilestone === m.id ? 'var(--primary)' : 'var(--surface-container-high)',
                          color: selectedMilestone === m.id ? 'var(--on-primary)' : 'var(--on-surface)',
                          border: 'none',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: selectedMilestone === m.id ? '0 4px 12px rgba(179, 27, 35, 0.2)' : 'none'
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <label className="label-md" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block', opacity: 0.6 }}>Target Date & Time</label>
                  <input
                    type="datetime-local"
                    value={targetDateTime}
                    onChange={(e) => setTargetDateTime(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem 1rem', 
                      background: 'var(--surface-container-high)', 
                      border: '1.5px solid var(--outline-variant)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--on-surface)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      colorScheme: theme === 'dark' ? 'dark' : 'light',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                      marginBottom: '1rem'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--outline-variant)'}
                  />

                  <label className="label-md" style={{ fontSize: '0.65rem', marginBottom: '0.5rem', display: 'block', opacity: 0.6 }}>
                    {selectedMilestone === 'custom' ? 'Completion Message' : 'Add Suffix Message'}
                  </label>
                  <input
                    type="text"
                    placeholder={selectedMilestone === 'custom' ? "e.g. Milestone Reached!" : "e.g. Name or specific note"}
                    value={goalMessage}
                    onChange={(e) => setGoalMessage(e.target.value.slice(0, 50))}
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem 1rem', 
                      background: 'var(--surface-container-high)', 
                      border: '1.5px solid var(--outline-variant)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--on-surface)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--outline-variant)'}
                  />
                </div>
              )}

              <div style={{ 
                marginTop: '1.5rem', 
                opacity: selectedType === option.id ? 1 : 0,
                visibility: selectedType === option.id ? 'visible' : 'hidden',
                transform: `translateY(${selectedType === option.id ? 0 : 10}px)`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <button 
                  className="btn-primary" 
                  disabled={option.isEvent && !targetDateTime}
                  style={{ 
                    padding: '0.8rem 1.5rem', 
                    fontSize: '0.9rem', 
                    width: '100%', 
                    gap: '0.6rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    opacity: (option.isEvent && !targetDateTime) ? 0.5 : 1,
                    cursor: (option.isEvent && !targetDateTime) ? 'not-allowed' : 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStart();
                  }}
                >
                  <PlayIcon size={18} />
                  <span>Start Countdown</span>
                </button>
              </div>
            </div>
          ))}
        </section>

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
