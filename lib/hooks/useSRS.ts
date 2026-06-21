'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWords } from './useWords';
import { getSessionCards, calculateNextReview } from '@/lib/srs/sm2';
import type { VocabCard, LanguageCode } from '@/lib/types';
import type { ReviewQuality } from '@/lib/srs/sm2';
import { XP_PER_QUALITY, SESSION_COMPLETION_BONUS } from '@/lib/types';
import { addXP, updateStreak, incrementCards, incrementSessions } from '@/lib/db/progress';

export function useSRS(languageCode: LanguageCode, maxCards: number = 20) {
  const { words, loading, update } = useWords(languageCode);
  const [sessionCards, setSessionCards] = useState<VocabCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    if (!loading && words.length > 0) {
      const cards = getSessionCards(words, maxCards);
      setSessionCards(cards);
    }
  }, [loading, words, maxCards]);

  const currentCard = sessionCards[currentIndex] ?? null;
  const progress = sessionCards.length > 0 ? currentIndex / sessionCards.length : 0;

  const submitReview = useCallback(
    async (quality: ReviewQuality) => {
      if (!currentCard) return;

      const updates = calculateNextReview(currentCard, quality);
      const updatedCard = { ...currentCard, ...updates };
      await update(updatedCard);

      const xp = XP_PER_QUALITY[quality];
      setSessionXP((prev) => prev + xp);
      setReviewedCount((prev) => prev + 1);
      await addXP(xp);
      await updateStreak();

      const nextIndex = currentIndex + 1;
      if (nextIndex >= sessionCards.length) {
        setSessionComplete(true);
        await addXP(SESSION_COMPLETION_BONUS);
        setSessionXP((prev) => prev + SESSION_COMPLETION_BONUS);
        await incrementCards(sessionCards.length);
        await incrementSessions();
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [currentCard, currentIndex, sessionCards.length, update]
  );

  const restartSession = useCallback(() => {
    if (words.length > 0) {
      const cards = getSessionCards(words, maxCards);
      setSessionCards(cards);
      setCurrentIndex(0);
      setSessionXP(0);
      setSessionComplete(false);
      setReviewedCount(0);
    }
  }, [words, maxCards]);

  return {
    currentCard,
    currentIndex,
    totalCards: sessionCards.length,
    progress,
    sessionXP,
    sessionComplete,
    reviewedCount,
    loading,
    submitReview,
    restartSession,
    dueCount: words.filter((w) => {
      const today = new Date().toISOString().split('T')[0];
      return w.dueDate <= today;
    }).length,
  };
}
