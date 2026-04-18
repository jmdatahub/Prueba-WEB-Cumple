import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton';
import { useAppAudio } from '../hooks/useAppAudio';

interface Props {
  src: string; // https://www.youtube.com/embed/VIDEO_ID
}

export default function FullscreenVideo({ src }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const audio = useAppAudio();

  // Extract video ID for thumbnail
  const videoId = src.split('/embed/')[1]?.split('?')[0] ?? '';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const embedSrc = `${src}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <>
      {/* Thumbnail preview */}
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl mx-auto"
        style={{
          maxWidth: '260px',
          width: '100%',
          aspectRatio: '9 / 16',
          border: '2px solid rgba(255,255,255,0.12)',
        }}
        onClick={() => { audio.playClick(); setIsOpen(true); }}
      >
        {/* YouTube thumbnail as background */}
        <img
          src={thumbnailUrl}
          alt="Vídeo"
          className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
          style={{ objectPosition: 'center' }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 group-hover:bg-black/20 transition-colors">
          {/* Play button */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
            style={{
              background: 'rgba(255, 0, 0, 0.85)',
              boxShadow: '0 0 30px rgba(255,0,0,0.5)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-white font-poppins font-bold text-sm bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
            ▶ Ver vídeo
          </span>
        </div>
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { audio.playClick(); setIsOpen(false); }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            {/* Video container – stop propagation so clicking the iframe doesn't close */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(90vw, 400px)',
                aspectRatio: '9 / 16',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
                border: '2px solid rgba(255,255,255,0.15)',
              }}
            >
              <iframe
                src={embedSrc}
                title="Vídeo de la pregunta"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </motion.div>

            {/* Close button */}
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
