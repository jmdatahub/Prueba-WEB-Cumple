import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton';
import { useAppAudio } from '../hooks/useAppAudio';

interface Props {
  src: string;
  alt?: string;
}

export default function FullscreenImage({ src, alt }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const audio = useAppAudio();

  return (
    <>
      {/* Thumbnail with overlay */}
      <div 
        className="w-full relative rounded-3xl overflow-hidden animate-fade-in shadow-2xl cursor-pointer group"
        onClick={() => { audio.playClick(); setIsOpen(true); }}
      >
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors z-10 flex flex-col items-center justify-center">
            <span className="text-white font-poppins font-bold bg-black/60 px-4 py-2 rounded-full opacity-90 backdrop-blur-sm border border-white/20 transform transition-transform group-hover:scale-105">
              🔍 Toca para ampliar
            </span>
        </div>
        <img
          src={src}
          alt={alt || "Toca para ampliar"}
          className="w-full object-cover max-h-64 brightness-75 transition-all duration-300 group-hover:brightness-100"
        />
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { audio.playClick(); setIsOpen(false); }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 md:p-6 cursor-zoom-out backdrop-blur-xl"
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={src}
              alt={alt || "Imagen ampliada"}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking the actual image
            />
            
            <AnimatedButton 
              onClick={() => setIsOpen(false)}
              soundType="click"
              className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AnimatedButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

