'use client';

import { getDB } from './indexeddb';
import type { Phrase, PhraseCategory, LanguageCode } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORE = 'phrases';

export async function getAllPhrases(languageCode: LanguageCode): Promise<Phrase[]> {
  const db = await getDB();
  const all = await db.getAll(STORE);
  return all.filter((p: Phrase) => p.languageCode === languageCode);
}

export async function getPhrasesByCategory(
  languageCode: LanguageCode,
  category: PhraseCategory
): Promise<Phrase[]> {
  const all = await getAllPhrases(languageCode);
  return all.filter((p) => p.category === category);
}

export async function putPhrase(phrase: Phrase): Promise<void> {
  const db = await getDB();
  await db.put(STORE, phrase);
}

export async function deletePhrase(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}

export async function getPhraseCount(languageCode: LanguageCode): Promise<number> {
  const phrases = await getAllPhrases(languageCode);
  return phrases.length;
}

export async function seedPhrasesIfEmpty(
  languageCode: LanguageCode,
  seedData: Omit<Phrase, 'id' | 'drillStatus' | 'createdAt'>[]
): Promise<void> {
  const count = await getPhraseCount(languageCode);
  if (count > 0) return;

  const db = await getDB();
  const tx = db.transaction(STORE, 'readwrite');
  const now = new Date().toISOString();

  for (const seed of seedData) {
    const phrase: Phrase = {
      ...seed,
      id: uuidv4(),
      drillStatus: 'unstarted',
      createdAt: now,
    };
    await tx.store.put(phrase);
  }
  await tx.done;
}

export async function updatePhraseStatus(
  id: string,
  status: Phrase['drillStatus']
): Promise<void> {
  const db = await getDB();
  const phrase = await db.get(STORE, id);
  if (!phrase) return;
  await db.put(STORE, { ...phrase, drillStatus: status, lastDrilledAt: new Date().toISOString() });
}
