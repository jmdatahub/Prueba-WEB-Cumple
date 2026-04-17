import React from 'react';

interface TimerProps {
  timeLeft: number;
  timeLimit: number;
}

export default function Timer({ timeLeft, timeLimit }: TimerProps) {
  if (timeLimit === 0 || timeLeft === -1) {
    return (
      <div className="relative flex items-center justify-center w-[72px] h-[72px]">
        <span className="font-black text-3xl text-white/50">∞</span>
      </div>
    );
  }

  const size = 72;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, timeLeft / timeLimit);
  const dashOffset = circumference * (1 - ratio);

  const color =
    ratio > 0.5
      ? '#22c55e'
      : ratio > 0.25
      ? '#f59e0b'
      : '#ef4444';

  const isUrgent = timeLeft <= 5 && timeLeft > 0;

  return (
    <div
      className={`relative flex items-center justify-center ${isUrgent ? 'animate-pulse-fast' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="5"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="timer-ring transition-all duration-300"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px`, transform: 'rotate(-90deg)' }}
        />
      </svg>
      <span
        className="relative font-black text-xl"
        style={{ color }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
