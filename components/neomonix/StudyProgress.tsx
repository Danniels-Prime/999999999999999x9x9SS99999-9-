'use client';

import { Zap } from 'lucide-react';

interface StudyProgressProps {
  current: number;
  total: number;
  sessionXP: number;
}

export default function StudyProgress({ current, total, sessionXP }: StudyProgressProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full max-w-lg mx-auto space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span style={{ color: 'var(--muted)' }}>{current} / {total} cards</span>
        <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--gold)' }}>
          <Zap size={14} />
          {sessionXP} XP
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-elevated)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
            boxShadow: '0 0 8px rgba(168,85,247,0.5)',
          }}
        />
      </div>
    </div>
  );
}
