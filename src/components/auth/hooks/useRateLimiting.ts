
import { useState, useEffect } from 'react';

export const useRateLimiting = () => {
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Reset attempts after 15 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      if (attempts > 0 && Date.now() - lastAttemptTime > 900000) {
        setAttempts(0);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [attempts, lastAttemptTime]);

  const recordAttempt = () => {
    const currentTime = Date.now();
    setAttempts(prev => prev + 1);
    setLastAttemptTime(currentTime);
  };

  const resetAttempts = () => {
    setAttempts(0);
  };

  const isRateLimited = attempts >= 5;
  const timeLeft = Math.ceil((900000 - (Date.now() - lastAttemptTime)) / 1000);

  return {
    attempts,
    isRateLimited,
    timeLeft,
    recordAttempt,
    resetAttempts
  };
};
