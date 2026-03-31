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
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-card" onClick={e => e.stopPropagation()}>
        <header style={{ marginBottom: 'var(--spacing-12)' }}>
          <h2 className="title-lg">Focus Store / Settings</h2>
          <p className="label-md" style={{ fontSize: '0.65rem', marginTop: '0.25rem', opacity: 0.5 }}>Configure your ideal focus durations</p>
        </header>
        
        <div className="settings-body">
          <div className="input-group">
            <label className="title-md" style={{ fontSize: '1rem', fontWeight: 500 }}>Pomodoro Focus</label>
            <input 
              type="number" 
              name="pomodoro" 
              value={localSettings.pomodoro} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label className="title-md" style={{ fontSize: '1rem', fontWeight: 500 }}>Short Rest</label>
            <input 
              type="number" 
              name="shortBreak" 
              value={localSettings.shortBreak} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label className="title-md" style={{ fontSize: '1rem', fontWeight: 500 }}>Long Recharge</label>
            <input 
              type="number" 
              name="longBreak" 
              value={localSettings.longBreak} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label className="title-md" style={{ fontSize: '1rem', fontWeight: 500 }}>Deep Work Session</label>
            <input 
              type="number" 
              name="deepWork" 
              value={localSettings.deepWork} 
              onChange={handleChange} 
            />
          </div>

          <div className="input-group" style={{ borderBottom: 'none', paddingTop: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label className="title-md" style={{ fontSize: '1rem', fontWeight: 500 }}>Tone Notification</label>
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
              <span>Test Melody</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-12)' }}>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onClose}>Discard</button>
          <button className="btn-primary" style={{ flex: 1, padding: '1rem' }} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default V2Settings;
