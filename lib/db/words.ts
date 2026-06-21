'use client';

import { getDB } from './indexeddb';
import type { VocabCard, LanguageCode } from '@/lib/types';
import { todayISO } from '@/lib/utils/date';
import { v4 as uuidv4 } from 'uuid';

const STORE = 'vocabCards';

export async function getAllWords(languageCode: LanguageCode): Promise<VocabCard[]> {
  const db = await getDB();
  const all = await db.getAll(STORE);
  return all.filter((c: VocabCard) => c.languageCode === languageCode);
}

export async function getWordById(id: string): Promise<VocabCard | undefined> {
  const db = await getDB();
  return db.get(STORE, id);
}

export async function putWord(card: VocabCard): Promise<void> {
  const db = await getDB();
  await db.put(STORE, { ...card, updatedAt: new Date().toISOString() });
}

export async function deleteWord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}

export async function getWordCount(languageCode: LanguageCode): Promise<number> {
  const words = await getAllWords(languageCode);
  return words.length;
}

export async function seedWordsIfEmpty(
  languageCode: LanguageCode,
  seedData: Omit<VocabCard, 'id' | 'srsLevel' | 'interval' | 'repetitions' | 'easeFactor' | 'dueDate' | 'createdAt' | 'updatedAt'>[]
): Promise<void> {
  const count = await getWordCount(languageCode);
  if (count > 0) return;

  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const today = todayISO();
  const now = new Date().toISOString();

  for (const seed of seedData) {
    const card: VocabCard = {
      ...seed,
      id: uuidv4(),
      srsLevel: 'new',
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: today,
      createdAt: now,
      updatedAt: now,
    };
    await tx.store.put(card);
  }
  await tx.done;
}
