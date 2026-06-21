'use client';

import { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import VideoCard from '@/components/highlands/VideoCard';
import GlowButton from '@/components/shared/GlowButton';
import { useVideos } from '@/lib/hooks/useVideos';
import { Mountain, Plus, Link as LinkIcon } from 'lucide-react';

export default function HighlandsPage() {
  const { videos, loading, addVideo, updateStatus, remove } = useVideos('ru');
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async () => {
    if (!url.trim()) return;
    setAdding(true);
    await addVideo(url.trim());
    setUrl('');
    setAdding(false);
    setShowForm(false);
  };

  return (
    <PageWrapper className="p-6 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mountain size={24} style={{ color: 'var(--success)' }} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Language Highlands</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Shadow native speakers. Save videos, listen deeply, repeat exactly.
          </p>
        </div>
        <GlowButton
          variant="accent"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add Video
        </GlowButton>
      </div>

      {/* Add video form */}
      {showForm && (
        <div className="cosmic-card p-5 mb-6 space-y-4">
          <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Add a YouTube video to your shadowing queue
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <GlowButton onClick={handleAdd} disabled={adding || !url.trim()}>
              {adding ? 'Adding...' : 'Add'}
            </GlowButton>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Works with YouTube URLs. Paste any video where native Russian speakers talk naturally.
          </div>
        </div>
      )}

      {/* Shadowing tip */}
      <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--muted)' }}>
        <span className="font-medium" style={{ color: 'var(--success)' }}>Language Highlands Method:</span>
        {' '}Watch → Listen → Pause → Shadow (repeat exactly). Start slow. Match intonation. Your accent will improve dramatically.
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>Loading queue...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="text-4xl">🏔️</div>
          <div className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Your queue is empty</div>
          <div className="text-sm" style={{ color: 'var(--muted)' }}>
            Add Russian YouTube videos to start shadowing native speakers
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onStatusChange={updateStatus}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
