import React, { useState } from 'react';
import { useFocus } from './useFocusStore';
import { VolumeIcon } from './V2Icons';
import { playCompletionTone } from './V2Sound';
import './v2.css';

const V2Settings = ({ onClose }) => {
  const { settings, updateSettings } = useFocus();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const isNumeric = ['pomodoro', 'shortBreak', 'longBreak', 'deepWork'].includes(name);
    setLocalSettings(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : (isNumeric ? (parseInt(value) || 0) : value) 
    }));
  };

  const fontOptions = [
    { id: 'Inter', label: 'Classic Sans' },
    { id: 'Outfit', label: 'Premium' },
    { id: 'Montserrat', label: 'Montserrat' },
    { id: 'Playfair Display', label: 'Elegant Serif' },
    { id: 'Chakra Petch', label: 'Cyber Tech' },
    { id: 'Space Grotesk', label: 'Modern Tech' },
    { id: 'JetBrains Mono', label: 'Developer' },
    { id: 'Roboto Mono', label: 'Roboto Mono' },
    { id: 'DSEG14', label: '14-Segment LED' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-card" onClick={e => e.stopPropagation()}>
        <header style={{ marginBottom: 'clamp(0.5rem, 2vh, var(--spacing-12))', flexShrink: 0 }}>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="title-lg" style={{ fontSize: 'clamp(1rem, min(4vw, 4vh), 1.5rem)' }}>Settings</h2>
            <button className="btn-ghost" onClick={onClose} style={{ padding: '0.25rem' }}>✕</button>
          </div>
          <p className="label-md" style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.5 }}>Configure your ideal focus workstation</p>
        </header>
        
        <div className="settings-body" style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 'var(--spacing-2)' }}>
          <section style={{ marginBottom: 'clamp(0.5rem, 2vh, var(--spacing-8))' }}>
            <h3 className="label-md" style={{ marginBottom: 'var(--spacing-4)', opacity: 0.8 }}>Durations (min)</h3>
            <div className="input-group">
              <label className="title-md" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pomodoro Focus</label>
              <input 
                type="number" 
                name="pomodoro" 
                value={localSettings.pomodoro} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label className="title-md" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Short Rest</label>
              <input 
                type="number" 
                name="shortBreak" 
                value={localSettings.shortBreak} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label className="title-md" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Long Recharge</label>
              <input 
                type="number" 
                name="longBreak" 
                value={localSettings.longBreak} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label className="title-md" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Deep Work</label>
              <input 
                type="number" 
                name="deepWork" 
                value={localSettings.deepWork} 
                onChange={handleChange} 
              />
            </div>
          </section>

          <section style={{ marginBottom: 'clamp(0.5rem, 2vh, var(--spacing-8))' }}>
            <h3 className="label-md" style={{ marginBottom: 'var(--spacing-4)', opacity: 0.8 }}>Typography</h3>
            <div className="input-group" style={{ gridTemplateColumns: '1fr' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)' }}>
                {fontOptions.map(font => (
                  <button
                    key={font.id}
                    className={`btn-secondary ${localSettings.fontFamily === font.id ? 'active' : ''}`}
                    onClick={() => setLocalSettings(prev => ({ ...prev, fontFamily: font.id }))}
                    style={{ 
                      padding: '0.65rem 0.25rem', 
                      fontSize: '0.65rem',
                      fontFamily: font.id === 'DSEG14' ? 'DSEG14' : `'${font.id}', sans-serif`,
                      fontStyle: font.id === 'DSEG14' ? 'italic' : 'normal',
                      border: localSettings.fontFamily === font.id ? '1.5px solid var(--primary)' : '1px solid transparent',
                      background: localSettings.fontFamily === font.id ? 'var(--surface-container-highest)' : 'var(--surface-container-low)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: localSettings.fontFamily === font.id ? 'var(--on-surface)' : 'var(--on-surface-variant)'
                    }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 'clamp(0.5rem, 2vh, var(--spacing-8))' }}>
            <h3 className="label-md" style={{ marginBottom: 'var(--spacing-4)', opacity: 0.8 }}>Preferences</h3>
            <div className="input-group" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="title-md" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Show Milliseconds</label>
              <input 
                type="checkbox" 
                name="showMilliseconds" 
                checked={localSettings.showMilliseconds} 
                onChange={handleChange}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>
          </section>
          <div className="input-group" style={{ borderBottom: 'none', paddingTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="title-md" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Tone Notification</label>
              <p className="label-md" style={{ fontSize: '0.6rem', marginTop: '0.2rem', opacity: 0.5, letterSpacing: '0.05em' }}>Plays a soft arpeggio upon completion</p>
            </div>
            <button 
              className="btn-ghost d-flex align-items-center" 
              onClick={(e) => {
                e.preventDefault();
                playCompletionTone();
              }}
              style={{ gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <VolumeIcon size={16} />
              <span>Test</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginTop: 'clamp(0.5rem, 2vh, var(--spacing-12))', flexShrink: 0 }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Discard</button>
          <button className="btn-primary" style={{ flex: 1, padding: 'clamp(0.6rem, 2vh, 1rem)' }} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default V2Settings;
