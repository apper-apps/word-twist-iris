import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime = 120) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, timeRemaining]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = (newTime = initialTime) => {
    setTimeRemaining(newTime);
    setIsActive(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
  };

  return {
    timeRemaining,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer
  };
};