'use client';

import { motion } from 'framer-motion';

interface StreakCardProps {
  streakDays: number;
  todayXP: number;
  dailyGoalXP: number;
}

export default function StreakCard({ streakDays, todayXP, dailyGoalXP }: StreakCardProps) {
  const pct = Math.min((todayXP / dailyGoalXP) * 100, 100);

  return (
    <div className="cosmic-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Daily Streak
        </div>
        <motion.div
          className="text-2xl animate-streak"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🔥
        </motion.div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-glow-gold" style={{ color: 'var(--gold)' }}>
          {streakDays}
        </span>
        <span className="text-lg mb-1" style={{ color: 'var(--muted)' }}>days</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>Today's XP</span>
          <span style={{ color: 'var(--gold)' }}>{todayXP} / {dailyGoalXP}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 100
                ? 'linear-gradient(90deg, var(--gold), var(--gold-glow))'
                : 'linear-gradient(90deg, var(--primary), var(--accent))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
