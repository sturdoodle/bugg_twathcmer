import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from './V2Icons';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const V2DateTimePicker = ({ value, onChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [ampm, setAmpm] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM');
  
  // Update internal state when prop changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      setSelectedDate(d);
      setViewDate(d);
      setAmpm(d.getHours() >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const cells = [];
    
    // Prev month days
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, month: month - 1, year, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ day: i, month, year, isCurrentMonth: true });
    }
    
    // Next month days
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, month: month + 1, year, isCurrentMonth: false });
    }
    
    return cells;
  }, [viewDate]);

  const handleDayClick = (cell) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(cell.year);
    newDate.setMonth(cell.month);
    newDate.setDate(cell.day);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (type, val) => {
    const newDate = new Date(selectedDate);
    if (type === 'hour') {
      let h = parseInt(val) || 0;
      if (h > 12) h = 12;
      if (h < 1) h = 1;
      
      let finalH = h;
      if (ampm === 'PM' && h < 12) finalH = h + 12;
      if (ampm === 'AM' && h === 12) finalH = 0;
      newDate.setHours(finalH);
    }
    if (type === 'minute') {
      let m = parseInt(val) || 0;
      if (m > 59) m = 59;
      if (m < 0) m = 0;
      newDate.setMinutes(m);
    }
    setSelectedDate(newDate);
  };

  const toggleAmpm = (newAmpm) => {
    if (newAmpm === ampm) return;
    const newDate = new Date(selectedDate);
    const h = newDate.getHours();
    if (newAmpm === 'PM' && h < 12) newDate.setHours(h + 12);
    if (newAmpm === 'AM' && h >= 12) newDate.setHours(h - 12);
    setAmpm(newAmpm);
    setSelectedDate(newDate);
  };

  const getLocalISO = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 16);
  };

  const handleDone = () => {
    onChange(getLocalISO(selectedDate));
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + offset);
    setViewDate(d);
  };

  const formatDisplay = () => {
    if (!value) return "Select target date & time";
    const d = new Date(value);
    return d.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDisplayHour = (h) => {
    let displayH = h % 12;
    if (displayH === 0) displayH = 12;
    return displayH.toString().padStart(2, '0');
  };

  return (
    <div className="datetime-picker-container" style={{ position: 'relative', width: '100%' }}>
      <button 
        className="v2-input d-flex align-items-center justify-content-between"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', 
          textAlign: 'left', 
          width: '100%', 
          gap: '1rem',
          padding: '0.8rem 1rem', 
          background: 'var(--surface-container-high)', 
          border: '1.5px solid var(--outline-variant)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--on-surface)',
          fontSize: '0.9rem'
        }}
      >
        <span style={{ opacity: value ? 1 : 0.5 }}>{formatDisplay()}</span>
        <CalendarIcon size={18} opacity={0.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="picker-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                zIndex: 100, background: 'rgba(0,0,0,0.1)' 
              }}
            />
            <motion.div
              className="custom-picker-modal"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: 'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--surface-container-high)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                border: '1px solid var(--outline-variant)',
                padding: 'clamp(1rem, 3vw, 1.25rem)',
                zIndex: 101,
                backdropFilter: 'blur(20px)',
                width: 'min(320px, 95vw)',
                maxWidth: '350px'
              }}
            >
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '0.75rem' }}>
                <h4 className="title-md" style={{ margin: 0, fontSize: '0.9rem' }}>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</h4>
                <div className="d-flex gap-1">
                  <button className="btn-ghost" onClick={() => changeMonth(-1)} style={{ padding: '0.3rem' }}>
                    <ChevronLeftIcon size={16} />
                  </button>
                  <button className="btn-ghost" onClick={() => changeMonth(1)} style={{ padding: '0.3rem' }}>
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '1rem' }}>
                {DAYS.map(d => (
                  <div key={d} className="label-md" style={{ textAlign: 'center', fontSize: '0.6rem', opacity: 0.5, padding: '0.25rem 0' }}>{d}</div>
                ))}
                {calendarData.map((cell, i) => {
                  const isSelected = selectedDate.getDate() === cell.day && 
                                   selectedDate.getMonth() === cell.month && 
                                   selectedDate.getFullYear() === cell.year;
                  const isToday = new Date().toDateString() === new Date(cell.year, cell.month, cell.day).toDateString();
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleDayClick(cell)}
                      style={{
                        aspectRatio: '1',
                        border: 'none',
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? 'var(--on-primary)' : (cell.isCurrentMonth ? 'var(--on-surface)' : 'var(--on-surface-variant)'),
                        opacity: cell.isCurrentMonth ? 1 : 0.25,
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? '700' : '400',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        padding: 0
                      }}
                    >
                      {cell.day}
                      {isToday && !isSelected && (
                        <div style={{ position: 'absolute', bottom: '2px', width: '3px', height: '3px', background: 'var(--primary)', borderRadius: '50%' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Time Selector */}
              <div style={{ padding: '0.75rem', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }}>
                <div className="d-flex align-items-center gap-2">
                  <ClockIcon size={16} opacity={0.5} />
                  <div className="d-flex align-items-center gap-1" style={{ flex: 1 }}>
                    <input 
                      type="number" 
                      value={getDisplayHour(selectedDate.getHours())}
                      onChange={(e) => handleTimeChange('hour', e.target.value)}
                      style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center', fontSize: '1rem', color: 'var(--on-surface)', fontWeight: '600', padding: 0 }}
                    />
                    <span style={{ opacity: 0.3 }}>:</span>
                    <input 
                      type="number" 
                      value={selectedDate.getMinutes().toString().padStart(2, '0')}
                      onChange={(e) => handleTimeChange('minute', e.target.value)}
                      style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'center', fontSize: '1rem', color: 'var(--on-surface)', fontWeight: '600', padding: 0 }}
                    />
                  </div>
                  <div className="d-flex gap-1" style={{ borderLeft: '1px solid var(--outline-variant)', paddingLeft: '0.5rem' }}>
                    <button 
                      className={`btn-ghost ${ampm === 'AM' ? 'active' : ''}`} 
                      onClick={() => toggleAmpm('AM')}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.6rem', borderRadius: '4px', background: ampm === 'AM' ? 'var(--primary)' : 'transparent', color: ampm === 'AM' ? 'var(--on-primary)' : 'inherit' }}
                    >AM</button>
                    <button 
                      className={`btn-ghost ${ampm === 'PM' ? 'active' : ''}`} 
                      onClick={() => toggleAmpm('PM')}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.6rem', borderRadius: '4px', background: ampm === 'PM' ? 'var(--primary)' : 'transparent', color: ampm === 'PM' ? 'var(--on-primary)' : 'inherit' }}
                    >PM</button>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn-ghost" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }} onClick={() => setIsOpen(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }} onClick={handleDone}>Set Date</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default V2DateTimePicker;
