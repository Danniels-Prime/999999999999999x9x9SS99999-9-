'use client';

import { motion } from 'framer-motion';
import type { Affirmation } from '@/lib/types';

interface AffirmationCardProps {
  affirmation: Affirmation;
}

const categoryColors = {
  confidence: 'var(--accent)',
  consistency: 'var(--gold)',
  growth: 'var(--success)',
  language: 'var(--primary-glow)',
};

export default function AffirmationCard({ affirmation }: AffirmationCardProps) {
  const color = categoryColors[affirmation.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="cosmic-card p-8 text-center space-y-4 relative overflow-hidden"
      style={{ border: `1px solid ${color}30` }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)` }}
      />

      <div className="text-xs font-medium uppercase tracking-widest" style={{ color }}>
        {affirmation.category} · Today's Affirmation
      </div>

      <blockquote
        className="text-xl font-medium leading-relaxed relative z-10"
        style={{ color: 'var(--foreground)', fontStyle: 'italic' }}
      >
        "{affirmation.text}"
      </blockquote>

      <div className="text-3xl">✨</div>
    </motion.div>
  );
}
