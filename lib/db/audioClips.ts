'use client';

import { getDB } from './indexeddb';
import type { AudioClip } from '@/lib/types';

const STORE = 'audioClips';

export async function getClipsByWordId(wordId: string): Promise<AudioClip[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORE, 'wordId', wordId);
  return all as AudioClip[];
}

export async function putAudioClip(clip: AudioClip): Promise<void> {
  const db = await getDB();
  await db.put(STORE, clip);
}

export async function deleteAudioClip(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}
