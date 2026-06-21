'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserProgress, putUserProgress } from '@/lib/db/progress';
import type { UserProgress, UserSettings } from '@/lib/types';
import { DEFAULT_USER_PROGRESS } from '@/lib/types';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({ ...DEFAULT_USER_PROGRESS });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const p = await getUserProgress();
    setProgress(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateSettings = useCallback(async (settings: Partial<UserSettings>) => {
    const updated: UserProgress = {
      ...progress,
      settings: { ...progress.settings, ...settings },
    };
    await putUserProgress(updated);
    setProgress(updated);
  }, [progress]);

  const refresh = useCallback(async () => {
    const p = await getUserProgress();
    setProgress(p);
  }, []);

  return { progress, loading, updateSettings, refresh };
}
