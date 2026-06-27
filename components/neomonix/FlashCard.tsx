'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VocabCard, AudioClip } from '@/lib/types';
import RatingButtons from './RatingButtons';
import MnemonicImage from './MnemonicImage';
import AudioPlayer from './AudioPlayer';
import type { ReviewQuality } from '@/lib/srs/sm2';
import { shouldShowGlitch, shouldShowNightmare } from '@/lib/utils/phantom';

interface FlashCardProps {
  card: VocabCard;
  clips: AudioClip[];
  showRomanization: boolean;
  streakDays: number;
  onRate: (quality: ReviewQuality) => void;
}

export default function FlashCard({ card, clips, showRomanization, streakDays, onRate }: FlashCardProps) {
  const [stage, setStage] = useState(0);

  // Decide phantom effects once per card mount
  const glitch = useMemo(() => shouldShowGlitch(streakDays), [streakDays]);
  const useNightmare = useMemo(() => shouldShowNightmare(card), [card]);
  const imageUrl = useNightmare ? card.altMnemonicImage : card.mnemonicImage;

  const advance = () => {
    if (stage < 3) setStage((s) => s + 1);
  };

  const handleRate = (quality: ReviewQuality) => {
    setStage(0);
    onRate(quality);
  };

  const tapHint = stage === 0
    ? 'tap for phonetic hook →'
    : stage === 1
    ? 'tap to see image →'
    : 'tap to reveal answer →';

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Card area */}
      <div
        className="cosmic-card gradient-border w-full select-none overflow-hidden relative"
        style={{
          minHeight: '320px',
          cursor: stage < 3 ? 'pointer' : 'default',
          padding: stage === 2 ? 0 : '2rem',
        }}
        onClick={stage < 3 ? advance : undefined}
        role={stage < 3 ? 'button' : undefined}
        tabIndex={stage < 3 ? 0 : undefined}
        onKeyDown={stage < 3 ? (e) => { if (e.key === 'Enter' || e.key === ' ') advance(); } : undefined}
        aria-label={stage < 3 ? 'Tap to reveal next layer' : undefined}
      >
        {stage === 2 ? (
          /* Stage 2: full-bleed mnemonic image */
          <div style={{ width: '100%', height: '320px' }}>
            <MnemonicImage src={imageUrl} alt={card.word} />
            <div
              className="absolute bottom-3 left-0 right-0 text-center text-xs"
              style={{ color: 'rgba(255,255,255,0.45)', pointerEvents: 'none' }}
            >
              tap to reveal answer →
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 w-full" style={{ minHeight: '256px' }}>
            {/* Part of speech / frequency */}
            <div className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              {card.partOfSpeech} · #{card.frequency}
            </div>

            {/* Russian word — glitch if phantom fires at stage 0 */}
            <div
              className={stage === 0 && glitch ? 'glitch-active' : ''}
              style={{
                fontSize: '3.5rem',
                fontWeight: 700,
                fontFamily: 'Noto Sans, sans-serif',
                color: 'var(--foreground)',
                textShadow: '0 0 30px rgba(168,85,247,0.3)',
                textAlign: 'center',
              }}
            >
              {card.word}
            </div>

            {showRomanization && (
              <div className="text-lg" style={{ color: 'var(--muted)' }}>
                /{card.romanization}/
              </div>
            )}

            {/* Stage 1: phonetic hook */}
            <AnimatePresence>
              {stage >= 1 && (
                <motion.div
                  key="hook"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 px-4 py-3 rounded-xl w-full text-center"
                  style={{
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(168,85,247,0.25)',
                  }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--primary-glow)', opacity: 0.7 }}>
                    phonetic hook
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', fontStyle: 'italic' }}>
                    {card.phoneticHook || card.mnemonicStory}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stage 3: translation + audio */}
            <AnimatePresence>
              {stage === 3 && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center gap-4 mt-1"
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--primary-glow)' }}>
                    {card.translation}
                  </div>
                  <AudioPlayer clips={clips} autoPlay />
                </motion.div>
              )}
            </AnimatePresence>

            {stage < 3 && (
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                {tapHint}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons — only at stage 3 */}
      <AnimatePresence>
        {stage === 3 && (
          <motion.div
            key="rating"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <RatingButtons onRate={handleRate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
