import type { VocabCard } from '@/lib/types';

export function shouldShowGlitch(streakDays: number): boolean {
  if (streakDays < 10) return false;
  return Math.random() < 0.05;
}

export function shouldShowNightmare(card: VocabCard): boolean {
  if (card.srsLevel !== 'mastered' || !card.altMnemonicImage) return false;
  return Math.random() < 0.1;
}

// Returns true if the current time falls within ±30 min of exactly 24h after lastReviewedAt.
export function checkSecretHourBonus(card: VocabCard): boolean {
  if (!card.lastReviewedAt) return false;
  const lastMs = new Date(card.lastReviewedAt).getTime();
  const targetMs = lastMs + 24 * 60 * 60 * 1000;
  const diffMs = Math.abs(Date.now() - targetMs);
  return diffMs <= 30 * 60 * 1000;
}
