'use client';

import { getDB } from '@/lib/db/indexeddb';

const STORES = ['vocabCards', 'sessions', 'phrases', 'videos', 'journalEntries', 'userProgress'];

export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const data: Record<string, unknown[]> = {};
  for (const store of STORES) {
    data[store] = await db.getAll(store);
  }
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
}

export function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(jsonString: string): Promise<void> {
  const parsed = JSON.parse(jsonString);
  if (!parsed.data) throw new Error('Invalid export format');

  const db = await getDB();
  for (const store of STORES) {
    if (!parsed.data[store]) continue;
    const tx = db.transaction(store, 'readwrite');
    await tx.store.clear();
    for (const item of parsed.data[store]) {
      await tx.store.put(item);
    }
    await tx.done;
  }
}
