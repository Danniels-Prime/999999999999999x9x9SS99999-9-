'use client';

import { getDB } from './indexeddb';
import type { UserProgress } from '@/lib/types';
import { DEFAULT_USER_PROGRESS } from '@/lib/types';
import { todayISO, daysBetween } from '@/lib/utils/date';

const STORE = 'userProgress';

export async function getUserProgress(): Promise<UserProgress> {
  const db = await getDB();
  const existing = await db.get(STORE, 'singleton');
  return existing ?? { ...DEFAULT_USER_PROGRESS };
}

export async function putUserProgress(progress: UserProgress): Promise<void> {
  const db = await getDB();
  await db.put(STORE, progress);
}

export async function updateStreak(): Promise<UserProgress> {
  const progress = await getUserProgress();
  const today = todayISO();

  if (progress.lastStudiedDate === today) return progress;

  const daysSinceLast = progress.lastStudiedDate
    ? daysBetween(progress.lastStudiedDate, today)
    : 0;

  let streakDays = progress.streakDays;
  if (daysSinceLast === 1) {
    streakDays += 1;
  } else if (daysSinceLast > 1) {
    streakDays = 1;
  } else {
    streakDays = 1;
  }

  const updated: UserProgress = {
    ...progress,
    streakDays,
    lastStudiedDate: today,
    todayXP: progress.lastStudiedDate === today ? progress.todayXP : 0,
  };

  await putUserProgress(updated);
  return updated;
}

export async function addXP(amount: number): Promise<UserProgress> {
  const progress = await getUserProgress();
  const updated: UserProgress = {
    ...progress,
    totalXP: progress.totalXP + amount,
    todayXP: progress.todayXP + amount,
  };
  await putUserProgress(updated);
  return updated;
}

export async function incrementCards(count: number): Promise<void> {
  const progress = await getUserProgress();
  await putUserProgress({
    ...progress,
    totalCardsLearned: progress.totalCardsLearned + count,
  });
}

export async function incrementSessions(): Promise<void> {
  const progress = await getUserProgress();
  await putUserProgress({
    ...progress,
    totalSessionsCompleted: progress.totalSessionsCompleted + 1,
  });
}
