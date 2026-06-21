'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { VocabCard } from '@/lib/types';
import RatingButtons from './RatingButtons';
import type { ReviewQuality } from '@/lib/srs/sm2';

interface FlashCardProps {
  card: VocabCard;
  showRomanization: boolean;
  onRate: (quality: ReviewQuality) => void;
}

export default function FlashCard({ card, showRomanization, onRate }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  const handleRate = (quality: ReviewQuality) => {
    setFlipped(false);
    setTimeout(() => onRate(quality), 150);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      <div
        className="flip-card w-full cursor-pointer select-none"
        style={{ height: '280px' }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleFlip() : null}
        aria-label={flipped ? 'Card showing answer' : 'Click to reveal answer'}
      >
        <motion.div
          className="flip-card-inner w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
        >
          {/* Front */}
          <div className="flip-card-face cosmic-card gradient-border w-full h-full flex flex-col items-center justify-center p-8 gap-3">
            <div className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              {card.partOfSpeech} · #{card.frequency}
            </div>
            <div
              className="text-5xl font-bold text-center"
              style={{
                fontFamily: 'Noto Sans, sans-serif',
                color: 'var(--foreground)',
                textShadow: '0 0 30px rgba(168,85,247,0.3)',
              }}
            >
              {card.word}
            </div>
            {showRomanization && (
              <div className="text-lg mt-1" style={{ color: 'var(--muted)' }}>
                /{card.romanization}/
              </div>
            )}
            <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
              tap to reveal →
            </div>
          </div>

          {/* Back */}
          <div
            className="flip-card-back flip-card-face cosmic-card w-full h-full flex flex-col items-center justify-center p-8 gap-3"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--primary)', boxShadow: '0 0 20px rgba(124,58,237,0.15)' }}
          >
            <div className="text-3xl font-bold text-center" style={{ color: 'var(--primary-glow)' }}>
              {card.translation}
            </div>
            {card.mnemonicStory && (
              <div
                className="text-sm text-center mt-2 leading-relaxed max-w-xs"
                style={{ color: 'var(--muted)', fontStyle: 'italic' }}
              >
                {card.mnemonicStory}
              </div>
            )}
            {card.exampleSentences?.[0] && (
              <div className="mt-3 px-4 py-2 rounded-lg w-full text-center" style={{ background: 'var(--surface)' }}>
                <div style={{ fontFamily: 'Noto Sans, sans-serif', color: 'var(--foreground)' }}>
                  {card.exampleSentences[0].sentence}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  {card.exampleSentences[0].translation}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: flipped ? 1 : 0, y: flipped ? 0 : 10 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="w-full"
        style={{ pointerEvents: flipped ? 'auto' : 'none' }}
      >
        <RatingButtons onRate={handleRate} />
      </motion.div>

      {!flipped && (
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          Click the card to reveal the answer
        </div>
      )}
    </div>
  );
}
