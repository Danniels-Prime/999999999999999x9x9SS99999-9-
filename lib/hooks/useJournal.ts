'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllJournalEntries, getJournalEntryByDate, upsertJournalEntry } from '@/lib/db/journal';
import type { JournalEntry } from '@/lib/types';
import { todayISO } from '@/lib/utils/date';

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | undefined>();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await getAllJournalEntries();
    setEntries(all);
    const today = await getJournalEntryByDate(todayISO());
    setTodayEntry(today);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (content: string, extras?: Partial<JournalEntry>) => {
    const entry = await upsertJournalEntry(todayISO(), content, extras);
    setTodayEntry(entry);
    setEntries((prev) => {
      const without = prev.filter((e) => e.date !== entry.date);
      return [entry, ...without];
    });
    return entry;
  }, []);

  return { entries, todayEntry, loading, save, reload: load };
}
