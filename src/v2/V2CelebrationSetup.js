import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFocus } from './useFocusStore';
import { HomeIcon, PlayIcon, SunIcon, MoonIcon } from './V2Icons';
import { unlockAudio } from './V2Sound';
import { loadFont } from './V2FontLoader';
import V2DateTimePicker from './V2DateTimePicker';
import './v2.css';

const CELEBRATION_FONTS = [
  { id: 'Outfit', label: 'Premium' },
  { id: 'Bungee', label: 'Playful' },
  { id: 'Lobster Two', label: 'Elegant Script' },
  { id: 'Playfair Display', label: 'Classic Serif' },
  { id: 'Chakra Petch', label: 'Cyber Tech' },
  { id: 'JetBrains Mono', label: 'Developer' },
  { id: 'Comfortaa', label: 'Soft Rounded' },
  { id: 'Rajdhani', label: 'Futuristic' },
  { id: 'Pacifico', label: 'Casual Script' },
  { id: 'Permanent Marker', label: 'Handwritten' },
  { id: 'Righteous', label: 'Modern Deco' },
  { id: 'Cinzel', label: 'Royal Serif' },
  { id: 'Aboreto', label: 'Artistic' },
  { id: 'Lora', label: 'Editorial' },
  { id: 'Montserrat', label: 'Clean Bold' },
  { id: 'Inconsolata', label: 'Typewriter' },
  { id: 'Alex Brush', label: 'Fluid Script' },
  { id: 'Dancing Script', label: 'Dancing' },
  { id: 'Kaushan Script', label: 'Bold Brush' },
  { id: 'Bebas Neue', label: 'Impact' },
  { id: 'Abril Fatface', label: 'Fashion' },
  { id: 'Syne', label: 'Art House' },
  { id: 'Unbounded', label: 'Wide Tech' },
  { id: 'Pinyon Script', label: 'Royal' },
  { id: 'Cormorant Garamond', label: 'Luxury Serif' },
  { id: 'Sacramento', label: 'Thin Script' },
  { id: 'Monoton', label: 'Retro Neon' },
  { id: 'Bungee Shade', label: 'Shade Block' },
  { id: 'Satisfy', label: 'Brush Script' },
  { id: 'Playfair Display SC', label: 'Small Caps' },
];

const MILESTONES = [
  { id: 'birthday', label: 'Birthday', icon: '🎂', defaultText: 'Happy Birthday' },
  { id: 'subscriber', label: 'Subscriber', icon: '🚀', defaultText: 'New Subscriber Milestone!' },
  { id: 'other', label: 'Other', icon: '✨', defaultText: 'Goal Reached!' },
];

const V2CelebrationSetup = () => {
  const navigate = useNavigate();
  const { startSession, theme, toggleTheme } = useFocus();
  
  const [type, setType] = useState('birthday');
  const [targetDate, setTargetDate] = useState('');
  const [heading, setHeading] = useState('Happy Birthday');
  const [message, setMessage] = useState('');
  const [headingFont, setHeadingFont] = useState('Outfit');
  const [messageFont, setMessageFont] = useState('Outfit');

  useEffect(() => {
    const milestone = MILESTONES.find(m => m.id === type);
    setHeading(milestone.defaultText);
  }, [type]);



  useEffect(() => {
    loadFont(headingFont);
  }, [headingFont]);

  useEffect(() => {
    loadFont(messageFont);
  }, [messageFont]);

  // SEO and Page Title
  useEffect(() => {
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    
    document.title = 'Setup Celebration - Focus / QPkendra';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Configure your custom milestone celebrations, birthdays, and subscriber goals with beautiful typography and countdown timers.');
    }

    return () => {
      document.title = originalTitle;
      if (metaDescription && originalDescription) {
        metaDescription.setAttribute('content', originalDescription);
      }
    };
  }, []);

  const handleStart = () => {
    if (!targetDate) return;
    unlockAudio();
    
    startSession('goal', 0, targetDate, heading, type, headingFont, messageFont, message);
    navigate('/timer');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const FontGrid = ({ selectedFont, onSelect, label }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label className="label-md" style={{ fontSize: '0.6rem', opacity: 0.6, marginBottom: '0.5rem', display: 'block' }}>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', padding: '2px' }}>
        {CELEBRATION_FONTS.map(f => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`btn-ghost ${selectedFont === f.id ? 'active' : ''}`}
            style={{ 
              padding: '0.5rem',
              fontSize: '0.7rem',
              textAlign: 'center',
              fontFamily: `'${f.id}', sans-serif`,
              border: selectedFont === f.id ? '1.5px solid var(--primary)' : '1.5px solid var(--outline-variant)',
              background: selectedFont === f.id ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
              borderRadius: 'var(--radius-default)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="v2-container">
      <header className="v2-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ padding: '0.5rem' }}>
            <HomeIcon size={20} />
          </button>
          <div>
            <h1 className="title-lg">Setup Goal</h1>
            <p className="label-md" style={{ fontSize: '0.6rem', opacity: 0.6 }}>Create a memorable milestone</p>
          </div>
        </div>
        <button className="btn-ghost" onClick={toggleTheme}>
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
      </header>

      <motion.main 
        className="v2-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}
      >
        <section className="setup-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', 
          gap: 'clamp(1rem, 5vw, 2.5rem)',
          paddingBottom: '2rem'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Type Selection */}
            <motion.div variants={itemVariants}>
              <label className="label-md" style={{ marginBottom: '1rem', display: 'block' }}>1. Choose Event Type</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {MILESTONES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setType(m.id)}
                    className={`btn-secondary ${type === m.id ? 'active' : ''}`}
                    style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '0.4rem',
                      padding: '1rem 0.25rem',
                      borderRadius: 'var(--radius-lg)',
                      border: type === m.id ? '2px solid var(--primary)' : '1px solid var(--outline-variant)',
                      background: type === m.id ? 'var(--surface-container-highest)' : 'var(--surface-container-low)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                    <span className="label-md" style={{ fontSize: '0.6rem' }}>{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div variants={itemVariants}>
              <label className="label-md" style={{ marginBottom: '1rem', display: 'block' }}>2. Event Details</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label-md" style={{ fontSize: '0.6rem', opacity: 0.6, marginBottom: '0.4rem', display: 'block' }}>Target Date & Time</label>
                  <V2DateTimePicker
                    value={targetDate}
                    onChange={setTargetDate}
                    theme={theme}
                  />
                </div>
                <div>
                  <label className="label-md" style={{ fontSize: '0.6rem', opacity: 0.6, marginBottom: '0.4rem', display: 'block' }}>Main Heading</label>
                  <input
                    type="text"
                    placeholder="e.g. New Subscriber Milestone!"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value.slice(0, 40))}
                    className="v2-input"
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem 1rem', 
                      background: 'var(--surface-container-high)', 
                      border: '1.5px solid var(--outline-variant)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--on-surface)',
                      fontSize: '0.9rem',
                      marginBottom: '1rem'
                    }}
                  />
                  <label className="label-md" style={{ fontSize: '0.6rem', opacity: 0.6, marginBottom: '0.4rem', display: 'block' }}>
                    {type === 'other' ? 'Sub-message' : 'Add Suffix (Name/Note)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shyam or Milestone!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 40))}
                    className="v2-input"
                    style={{ 
                      width: '100%', 
                      padding: '0.8rem 1rem', 
                      background: 'var(--surface-container-high)', 
                      border: '1.5px solid var(--outline-variant)',
                      borderRadius: 'var(--radius-lg)',
                      color: 'var(--on-surface)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Font Selection */}
            <motion.div variants={itemVariants}>
              <label className="label-md" style={{ marginBottom: '1rem', display: 'block' }}>3. Select Vibe (Fonts)</label>
              <FontGrid label="Heading Font" selectedFont={headingFont} onSelect={setHeadingFont} />
              <FontGrid label="Suffix Font" selectedFont={messageFont} onSelect={setMessageFont} />
            </motion.div>
          </div>

          {/* Preview Panel */}
          <motion.div 
            variants={itemVariants}
            style={{ 
              background: 'var(--surface-container-low)', 
              borderRadius: 'var(--radius-xl)', 
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--outline-variant)',
              minHeight: '450px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="label-md" style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', opacity: 0.4 }}>Preview</div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`${headingFont}-${messageFont}-${heading}-${message}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                style={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  maxWidth: '100%'
                }}
              >
                <span style={{ 
                  fontFamily: `'${headingFont}', sans-serif`,
                  color: 'var(--primary)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  lineHeight: 1.1,
                  wordBreak: 'break-word'
                }}>
                  {heading || "Goal Reached!"}
                </span>
                {message && (
                  <span style={{ 
                    fontFamily: `'${messageFont}', sans-serif`,
                    color: 'var(--on-surface)',
                    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                    lineHeight: 1.1,
                    opacity: 0.8,
                    wordBreak: 'break-word'
                  }}>
                    {message}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>

            <div style={{ marginTop: 'auto', width: '100%', paddingTop: '2rem' }}>
              <button 
                className="btn-primary" 
                onClick={handleStart}
                disabled={!targetDate}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.75rem',
                  opacity: !targetDate ? 0.5 : 1,
                  cursor: !targetDate ? 'not-allowed' : 'pointer'
                }}
              >
                <PlayIcon size={20} />
                <span>Start Goal Timer</span>
              </button>
            </div>
          </motion.div>

        </section>
      </motion.main>
    </div>
  );
};

export default V2CelebrationSetup;
