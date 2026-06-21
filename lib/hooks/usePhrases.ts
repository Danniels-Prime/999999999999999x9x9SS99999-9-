'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllPhrases, putPhrase, deletePhrase, seedPhrasesIfEmpty, updatePhraseStatus } from '@/lib/db/phrases';
import { russianPhrases } from '@/lib/seed/russian-phrases';
import type { Phrase, PhraseCategory, LanguageCode } from '@/lib/types';

export function usePhrases(languageCode: LanguageCode, category?: PhraseCategory) {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    if (languageCode === 'ru') {
      await seedPhrasesIfEmpty('ru', russianPhrases);
    }
    const all = await getAllPhrases(languageCode);
    const filtered = category ? all.filter((p) => p.category === category) : all;
    setPhrases(filtered);
    setLoading(false);
  }, [languageCode, category]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback(async (id: string, status: Phrase['drillStatus']) => {
    await updatePhraseStatus(id, status);
    setPhrases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, drillStatus: status } : p))
    );
  }, []);

  const add = useCallback(async (phrase: Phrase) => {
    await putPhrase(phrase);
    setPhrases((prev) => [...prev, phrase]);
  }, []);

  const remove = useCallback(async (id: string) => {
    await deletePhrase(id);
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { phrases, loading, updateStatus, add, remove, reload: load };
}
