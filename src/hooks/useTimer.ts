import { useEffect, useState } from 'react';
import { QUESTIONS } from '../data/questions';

export function useTimer(questionStartTime: number, questionIndex: number) {
  const question = QUESTIONS[questionIndex];
  const timeLimit = question?.timeLimit ?? 20;

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (timeLimit === 0) return -1;
    if (questionStartTime === 0) return timeLimit;
    return Math.max(0, timeLimit - Math.floor((Date.now() - questionStartTime) / 1000));
  });

  useEffect(() => {
    if (timeLimit === 0) {
      setTimeLeft(-1);
      return;
    }
    if (questionStartTime === 0) {
      setTimeLeft(timeLimit);
      return;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimeLeft(Math.max(0, timeLimit - elapsed));
    };

    tick(); // immediate update
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [questionStartTime, timeLimit]);

  return { timeLeft, timeLimit };
}
