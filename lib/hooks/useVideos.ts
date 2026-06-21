'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllVideos, putVideo, deleteVideo, updateVideoStatus, createVideoEntry } from '@/lib/db/videos';
import type { VideoEntry, LanguageCode, VideoWatchStatus } from '@/lib/types';

export function useVideos(languageCode: LanguageCode) {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await getAllVideos(languageCode);
    setVideos(all);
    setLoading(false);
  }, [languageCode]);

  useEffect(() => {
    load();
  }, [load]);

  const addVideo = useCallback(async (url: string, title?: string) => {
    const video = await createVideoEntry(url, languageCode, title);
    setVideos((prev) => [video, ...prev]);
    return video;
  }, [languageCode]);

  const updateStatus = useCallback(async (id: string, status: VideoWatchStatus) => {
    await updateVideoStatus(id, status);
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, watchStatus: status } : v))
    );
  }, []);

  const update = useCallback(async (video: VideoEntry) => {
    await putVideo(video);
    setVideos((prev) => prev.map((v) => (v.id === video.id ? video : v)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteVideo(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return { videos, loading, addVideo, updateStatus, update, remove, reload: load };
}
