import React from 'react';
import { TEAMS } from '../data/players';

interface TeamBadgeProps {
  teamId: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function TeamBadge({ teamId, showName = true, size = 'md' }: TeamBadgeProps) {
  const team = TEAMS[teamId];
  if (!team) return null;

  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold ${textSize}`}>
      <span
        className={`${dotSize} rounded-full flex-shrink-0`}
        style={{ backgroundColor: team.color }}
      />
      {showName && <span style={{ color: team.color }}>{team.name}</span>}
    </span>
  );
}
