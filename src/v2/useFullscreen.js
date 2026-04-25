import { useState, useEffect, useCallback } from 'react';

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`);
          });
        }
      }
    } catch (err) {
      console.error(`Error toggling fullscreen: ${err.message}`);
    }
  }, []);


  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
};

export default useFullscreen;
