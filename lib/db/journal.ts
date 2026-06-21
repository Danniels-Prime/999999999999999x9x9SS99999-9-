'use client';

import { getDB } from './indexeddb';
import type { JournalEntry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORE = 'journalEntries';

export async function getAllJournalEntries(): Promise<JournalEntry[]> {
  const db = await getDB();
  const all = await db.getAll(STORE);
  return (all as JournalEntry[]).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getJournalEntryByDate(date: string): Promise<JournalEntry | undefined> {
  const all = await getAllJournalEntries();
  return all.find((e) => e.date === date);
}

export async function upsertJournalEntry(
  date: string,
  content: string,
  extras?: Partial<JournalEntry>
): Promise<JournalEntry> {
  const db = await getDB();
  const existing = await getJournalEntryByDate(date);
  const entry: JournalEntry = {
    id: existing?.id ?? uuidv4(),
    date,
    content,
    ...extras,
    updatedAt: new Date().toISOString(),
  };
  await db.put(STORE, entry);
  return entry;
}
