/**
 * V2Sound.js - Minimalist Audio Engine for "The Silent Conductor"
 * Synthesizes a soft, sine-wave arpeggio using the Web Audio API.
 */

let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playCompletionTone = () => {
  initAudio();
  
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Soft Major Arpeggio)
  const startTime = audioCtx.currentTime;
  
  notes.forEach((freq, index) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, startTime + (index * 0.15)); // Slightly more spacing
    
    // Smooth, editorial-grade envelope for "The Silent Conductor" aesthetic
    gainNode.gain.setValueAtTime(0, startTime + (index * 0.15));
    // Slower attack (0.1s) to eliminate harsh clicks
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + (index * 0.15) + 0.1); 
    // Natural exponential decay (1s) for a smoother finish
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + (index * 0.15) + 1.0);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start(startTime + (index * 0.15));
    oscillator.stop(startTime + (index * 0.15) + 1.1); // Stop after decay
  });
};

// Also expose init for the "Start" interaction to unlock audio
export const unlockAudio = () => {
  initAudio();
};
