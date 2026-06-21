'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllWords, putWord, deleteWord } from '@/lib/db/words';
import { seedWordsIfEmpty } from '@/lib/db/words';
import { russianWords } from '@/lib/seed/russian-words';
import type { VocabCard, LanguageCode } from '@/lib/types';

export function useWords(languageCode: LanguageCode) {
  const [words, setWords] = useState<VocabCard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    if (languageCode === 'ru') {
      await seedWordsIfEmpty('ru', russianWords);
    }
    const all = await getAllWords(languageCode);
    setWords(all.sort((a, b) => a.frequency - b.frequency));
    setLoading(false);
  }, [languageCode]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(async (card: VocabCard) => {
    await putWord(card);
    setWords((prev) => prev.map((c) => (c.id === card.id ? card : c)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteWord(id);
    setWords((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { words, loading, update, remove, reload: load };
}
