'use client';

import { useState } from 'react';

interface ShadowPlayerProps {
  videoId: string;
}

const speeds = [0.5, 0.75, 1, 1.25, 1.5];

export default function ShadowPlayer({ videoId }: ShadowPlayerProps) {
  const [speed, setSpeed] = useState(1);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;

  return (
    <div className="space-y-4">
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Shadow Learning Video"
        />
      </div>

      <div className="cosmic-card p-4 space-y-3">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Playback Speed
        </div>
        <div className="flex gap-2 flex-wrap">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{
                background: speed === s ? 'var(--primary)' : 'var(--surface)',
                color: speed === s ? 'white' : 'var(--muted)',
                border: `1px solid ${speed === s ? 'var(--primary)' : 'var(--border)'}`,
              }}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="p-3 rounded-xl text-sm" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>
          <span className="font-medium" style={{ color: 'var(--accent)' }}>Shadowing Technique:</span>
          {' '}Listen → Pause → Repeat exactly what you heard. Start at 0.75x and work up to 1.25x.
          Shadow the intonation, rhythm, and stress — not just the words.
        </div>
      </div>
    </div>
  );
}
