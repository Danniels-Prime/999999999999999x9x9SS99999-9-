import type { VocabCard, SRSLevel } from '@/lib/types';
import { todayISO, addDays } from '@/lib/utils/date';

export type ReviewQuality = 0 | 2 | 3 | 5;

export function calculateNextReview(
  card: VocabCard,
  quality: ReviewQuality
): Pick<VocabCard, 'interval' | 'repetitions' | 'easeFactor' | 'dueDate' | 'srsLevel' | 'lastReviewedAt'> {
  let { interval, repetitions, easeFactor } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easeFactor = Math.max(1.3, easeFactor);

  const dueDate = addDays(todayISO(), interval);
  const srsLevel = estimateSRSLevel(repetitions, interval);

  return {
    interval,
    repetitions,
    easeFactor,
    dueDate,
    srsLevel,
    lastReviewedAt: new Date().toISOString(),
  };
}

export function estimateSRSLevel(repetitions: number, interval: number): SRSLevel {
  if (repetitions < 3) return 'new';
  if (interval <= 10) return 'learning';
  if (interval <= 60) return 'review';
  return 'mastered';
}

export function getDueCards(cards: VocabCard[]): VocabCard[] {
  const today = todayISO();
  return cards.filter((c) => c.dueDate <= today);
}

export function getNewCards(cards: VocabCard[], limit: number): VocabCard[] {
  return cards
    .filter((c) => c.srsLevel === 'new')
    .sort((a, b) => a.frequency - b.frequency)
    .slice(0, limit);
}

export function getSessionCards(cards: VocabCard[], maxCards: number): VocabCard[] {
  const due = getDueCards(cards);
  if (due.length >= maxCards) return due.slice(0, maxCards);
  const remaining = maxCards - due.length;
  const newCards = getNewCards(
    cards.filter((c) => c.srsLevel === 'new'),
    remaining
  );
  return [...due, ...newCards];
}
