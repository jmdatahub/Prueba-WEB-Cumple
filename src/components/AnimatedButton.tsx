import React from 'react';
import { motion } from 'framer-motion';
import { useAppAudio } from '../hooks/useAppAudio';

interface AnimatedButtonProps extends React.ComponentProps<typeof motion.button> {
  soundType?: 'click' | 'correct' | 'error' | 'pop' | 'none';
  vibrateOnClick?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onClick, 
  soundType = 'click',
  vibrateOnClick = true,
  className,
  onMouseEnter,
  ...props 
}) => {
  const audio = useAppAudio();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play sound based on type
    if (soundType !== 'none') {
      if (soundType === 'click') audio.playClick();
      else if (soundType === 'correct') audio.playCorrect();
      else if (soundType === 'error') audio.playError();
      else if (soundType === 'pop') audio.playPop();
    }

    // Try haptic feedback if available on mobile
    if (vibrateOnClick && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(50); } catch(err) {} 
    }

    if (onClick) onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundType !== 'none') {
      audio.playHover();
    }
    if (onMouseEnter) onMouseEnter(e);
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};
