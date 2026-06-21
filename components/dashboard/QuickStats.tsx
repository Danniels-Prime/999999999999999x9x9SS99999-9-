'use client';

import type { UserProgress } from '@/lib/types';
import { BookOpen, Zap, Trophy, Flame } from 'lucide-react';

interface QuickStatsProps {
  progress: UserProgress;
  dueCards: number;
}

export default function QuickStats({ progress, dueCards }: QuickStatsProps) {
  const stats = [
    { label: 'Total XP', value: progress.totalXP.toLocaleString(), icon: Zap, color: 'var(--gold)' },
    { label: 'Words Learned', value: progress.totalCardsLearned.toString(), icon: BookOpen, color: 'var(--accent)' },
    { label: 'Sessions', value: progress.totalSessionsCompleted.toString(), icon: Trophy, color: 'var(--primary-glow)' },
    { label: 'Due Now', value: dueCards.toString(), icon: Flame, color: dueCards > 0 ? 'var(--danger)' : 'var(--success)' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="cosmic-card p-4 flex flex-col gap-2">
          <Icon size={18} style={{ color }} />
          <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{value}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
