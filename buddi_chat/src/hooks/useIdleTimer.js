import { useState, useEffect } from 'react';
import logger from '../utils/logger';

const useIdleTimer = (timeout = 300000, onTimeout) => {
  const [remaining, setRemaining] = useState(timeout);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer;
    let lastActivity = Date.now();

    const resetTimer = () => {
      lastActivity = Date.now();
      setIsIdle(false);
      setRemaining(timeout);
    };

    const checkIdle = () => {
      const timeSinceLast = Date.now() - lastActivity;
      setRemaining(timeout - timeSinceLast);

      if (timeSinceLast > timeout) {
        setIsIdle(true);
        onTimeout?.();
        logger.warn('Session timeout due to inactivity');
      }
    };

    const handleActivity = () => {
      resetTimer();
      window.addEventListener('mousemove', resetTimer, { once: true });
      window.addEventListener('keydown', resetTimer, { once: true });
      window.addEventListener('click', resetTimer, { once: true });
    };

    handleActivity();
    timer = setInterval(checkIdle, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [timeout, onTimeout]);

  return { isIdle, remaining };
};

export default useIdleTimer;
