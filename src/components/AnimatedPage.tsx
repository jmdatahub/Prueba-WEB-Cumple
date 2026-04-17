import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppAudio } from '../hooks/useAppAudio';

interface AnimatedPageProps extends React.ComponentProps<typeof motion.div> {
  playSoundOnMount?: boolean;
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({ 
  children, 
  className = "page relative", // Default .page class
  playSoundOnMount = true,
  ...props
}) => {
  const audio = useAppAudio();

  useEffect(() => {
    if (playSoundOnMount) {
      setTimeout(() => audio.playPop(), 50);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.02, y: -10 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
