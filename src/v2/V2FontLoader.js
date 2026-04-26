/**
 * Utility to lazily load Google Fonts by injecting a link tag.
 */
const loadedFonts = new Set();

export const loadFont = (fontFamily) => {
  if (!fontFamily || fontFamily === 'Inter' || fontFamily === 'Outfit' || fontFamily === 'DSEG14' || loadedFonts.has(fontFamily)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
};

export const loadMultipleFonts = (fonts) => {
  fonts.forEach(loadFont);
};
