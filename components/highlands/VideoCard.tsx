'use client';

import Link from 'next/link';
import type { VideoEntry, VideoWatchStatus } from '@/lib/types';
import { Play, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

interface VideoCardProps {
  video: VideoEntry;
  onStatusChange: (id: string, status: VideoWatchStatus) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<VideoWatchStatus, string> = {
  unwatched: 'var(--muted)',
  'in-progress': 'var(--accent)',
  watched: 'var(--success)',
  'shadow-complete': 'var(--gold)',
};

const statusLabels: Record<VideoWatchStatus, string> = {
  unwatched: 'Unwatched',
  'in-progress': 'In Progress',
  watched: 'Watched',
  'shadow-complete': 'Shadowed ✓',
};

export default function VideoCard({ video, onStatusChange, onDelete }: VideoCardProps) {
  return (
    <div className="cosmic-card overflow-hidden group">
      <div className="relative">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-44 flex items-center justify-center" style={{ background: 'var(--surface)' }}>
            <Play size={32} style={{ color: 'var(--muted)' }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${statusColors[video.watchStatus]}20`, color: statusColors[video.watchStatus], border: `1px solid ${statusColors[video.watchStatus]}40` }}
          >
            {statusLabels[video.watchStatus]}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="font-medium text-sm leading-snug" style={{ color: 'var(--foreground)' }}>
          {video.title}
        </div>

        {video.notes && (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{video.notes}</div>
        )}

        <div className="flex gap-2 flex-wrap">
          {video.youtubeId && (
            <Link
              href={`/highlands/shadow?videoId=${video.youtubeId}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--primary-glow)', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              <Play size={12} /> Shadow
            </Link>
          )}

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            <ExternalLink size={12} /> Open
          </a>

          {video.watchStatus !== 'shadow-complete' && (
            <button
              onClick={() => onStatusChange(video.id,
                video.watchStatus === 'unwatched' ? 'in-progress' :
                video.watchStatus === 'in-progress' ? 'watched' : 'shadow-complete'
              )}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 cursor-pointer"
              style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <CheckCircle size={12} /> Mark Next
            </button>
          )}

          <button
            onClick={() => onDelete(video.id)}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 cursor-pointer"
            style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
