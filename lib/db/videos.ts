'use client';

import { getDB } from './indexeddb';
import type { VideoEntry, LanguageCode, VideoWatchStatus } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORE = 'videos';

export async function getAllVideos(languageCode: LanguageCode): Promise<VideoEntry[]> {
  const db = await getDB();
  const all = await db.getAll(STORE);
  return (all as VideoEntry[])
    .filter((v) => v.languageCode === languageCode)
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}

export async function getVideoById(id: string): Promise<VideoEntry | undefined> {
  const db = await getDB();
  return db.get(STORE, id);
}

export async function putVideo(video: VideoEntry): Promise<void> {
  const db = await getDB();
  await db.put(STORE, video);
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE, id);
}

export async function updateVideoStatus(id: string, status: VideoWatchStatus): Promise<void> {
  const db = await getDB();
  const video = await db.get(STORE, id);
  if (!video) return;
  await db.put(STORE, { ...video, watchStatus: status, lastOpenedAt: new Date().toISOString() });
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function createVideoEntry(
  url: string,
  languageCode: LanguageCode,
  title?: string
): Promise<VideoEntry> {
  const youtubeId = extractYoutubeId(url);
  const video: VideoEntry = {
    id: uuidv4(),
    languageCode,
    url,
    youtubeId: youtubeId ?? undefined,
    title: title ?? 'Loading...',
    thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : undefined,
    tags: [],
    watchStatus: 'unwatched',
    savedPhraseIds: [],
    addedAt: new Date().toISOString(),
  };
  await putVideo(video);
  return video;
}
