'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Phrase } from '@/lib/types';
import GlowButton from '@/components/shared/GlowButton';
import { RotateCcw, Check, X } from 'lucide-react';

interface DrillSessionProps {
  phrases: Phrase[];
  direction: 'ru-en' | 'en-ru';
  onUpdateStatus: (id: string, status: Phrase['drillStatus']) => void;
  onFinish: (results: { known: number; learning: number }) => void;
}

export default function DrillSession({ phrases, direction, onUpdateStatus, onFinish }: DrillSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  const [learning, setLearning] = useState(0);

  const current = phrases[index];
  const front = direction === 'ru-en' ? current.original : current.translation;
  const back = direction === 'ru-en' ? current.translation : current.original;
  const frontLabel = direction === 'ru-en' ? 'Russian' : 'English';
  const backLabel = direction === 'ru-en' ? 'English' : 'Russian';

  const next = useCallback(
    (status: 'known' | 'learning') => {
      onUpdateStatus(current.id, status);
      if (status === 'known') setKnown((k) => k + 1);
      else setLearning((l) => l + 1);

      setRevealed(false);
      if (index + 1 >= phrases.length) {
        onFinish({ known: known + (status === 'known' ? 1 : 0), learning: learning + (status === 'learning' ? 1 : 0) });
      } else {
        setIndex((i) => i + 1);
      }
    },
    [current, index, known, learning, onUpdateStatus, onFinish, phrases.length]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
          <span>{index + 1} / {phrases.length}</span>
          <span>{frontLabel} → {backLabel}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((index) / phrases.length) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--primary))' }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
          <div
            className="cosmic-card p-8 flex flex-col items-center gap-4 min-h-[220px] justify-center cursor-pointer"
            onClick={() => !revealed && setRevealed(true)}
            style={{ border: revealed ? '1px solid var(--primary)' : '1px solid var(--border)' }}
          >
            <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{frontLabel}</div>
            <div
              className="text-3xl font-bold text-center"
              style={{ fontFamily: direction === 'ru-en' ? 'Noto Sans, sans-serif' : 'Space Grotesk, sans-serif', color: 'var(--foreground)' }}
            >
              {front}
            </div>
            {current.romanization && direction === 'ru-en' && (
              <div style={{ color: 'var(--muted)' }}>/{current.romanization}/</div>
            )}

            {revealed ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2 pt-4 border-t w-full"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{backLabel}</div>
                <div className="text-2xl font-semibold text-center" style={{ color: 'var(--primary-glow)' }}>{back}</div>
              </motion.div>
            ) : (
              <div className="text-sm mt-2" style={{ color: 'var(--muted)' }}>tap to reveal →</div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 w-full"
        >
          <button
            onClick={() => next('learning')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 cursor-pointer btn-again border"
          >
            <X size={16} /> Still Learning
          </button>
          <button
            onClick={() => next('known')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 cursor-pointer btn-easy border"
          >
            <Check size={16} /> Know It!
          </button>
        </motion.div>
      )}
    </div>
  );
}
