'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import FlashCard from '@/components/neomonix/FlashCard';
import StudyProgress from '@/components/neomonix/StudyProgress';
import GlowButton from '@/components/shared/GlowButton';
import { useSRS } from '@/lib/hooks/useSRS';
import { useProgress } from '@/lib/hooks/useProgress';
import { getClipsByWordId } from '@/lib/db/audioClips';
import { addXP } from '@/lib/db/progress';
import { checkSecretHourBonus } from '@/lib/utils/phantom';
import type { AudioClip } from '@/lib/types';
import type { ReviewQuality } from '@/lib/srs/sm2';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';

export default function StudyPage() {
  const { progress } = useProgress();
  const {
    currentCard,
    currentIndex,
    totalCards,
    sessionXP,
    sessionComplete,
    reviewedCount,
    loading,
    submitReview,
    restartSession,
  } = useSRS('ru', progress.settings.cardsPerSession);

  const [clips, setClips] = useState<AudioClip[]>([]);

  useEffect(() => {
    if (!currentCard) { setClips([]); return; }
    getClipsByWordId(currentCard.id).then(setClips).catch(() => setClips([]));
  }, [currentCard?.id]);

  const handleRate = useCallback(async (quality: ReviewQuality) => {
    if (currentCard && checkSecretHourBonus(currentCard)) {
      await addXP(5);
    }
    await submitReview(quality);
  }, [currentCard, submitReview]);

  const showRomanization = progress.settings.showRomanization;
  const streakDays = progress.streakDays;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-glow text-lg" style={{ color: 'var(--primary-glow)' }}>
          Preparing your session...
        </div>
      </div>
    );
  }

  if (totalCards === 0) {
    return (
      <PageWrapper className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>No cards due!</h2>
        <p style={{ color: 'var(--muted)' }}>Your vocabulary is all caught up. Come back tomorrow for more reviews.</p>
        <Link href="/neomonix">
          <GlowButton variant="ghost">← Back to Word List</GlowButton>
        </Link>
      </PageWrapper>
    );
  }

  if (sessionComplete) {
    return (
      <PageWrapper className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl"
        >
          🏆
        </motion.div>
        <h2 className="text-3xl font-bold shimmer-text">Session Complete!</h2>
        <div className="cosmic-card p-6 w-full space-y-3">
          <div className="flex justify-between">
            <span style={{ color: 'var(--muted)' }}>Cards Reviewed</span>
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{reviewedCount}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--muted)' }}>XP Earned</span>
            <span className="font-bold" style={{ color: 'var(--gold)' }}>+{sessionXP} XP ⚡</span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <GlowButton onClick={restartSession} className="flex items-center gap-2">
            <RotateCcw size={16} /> Study More
          </GlowButton>
          <Link href="/">
            <GlowButton variant="ghost" className="flex items-center gap-2">
              <Trophy size={16} /> Back to Dashboard
            </GlowButton>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/neomonix" className="p-2 rounded-xl transition-colors hover:bg-[var(--surface-elevated)]">
          <ArrowLeft size={20} style={{ color: 'var(--muted)' }} />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Neomonix Study</h1>
      </div>

      <div className="space-y-8">
        {currentCard && <StudyProgress current={currentIndex} total={totalCards} sessionXP={sessionXP} />}
        {currentCard && (
          <FlashCard
            card={currentCard}
            clips={clips}
            showRomanization={showRomanization}
            streakDays={streakDays}
            onRate={handleRate}
          />
        )}
      </div>
    </PageWrapper>
  );
}
