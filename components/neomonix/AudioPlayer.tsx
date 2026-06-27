'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import type { AudioClip } from '@/lib/types';

interface AudioPlayerProps {
  clips: AudioClip[];
  autoPlay?: boolean;
}

export default function AudioPlayer({ clips, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState<0.75 | 1>(1);

  const clip = clips.find((c) => c.speedTag === 'natural') ?? clips[0] ?? null;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);

  useEffect(() => {
    if (autoPlay && audioRef.current && clip) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoPlay, clip]);

  if (!clip) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleEnded = () => setPlaying(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center gap-3"
    >
      <audio
        ref={audioRef}
        src={clip.audioUrl}
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
          style={{
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(168,85,247,0.4)',
            color: 'var(--primary-glow)',
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={() => setRate(rate === 1 ? 0.75 : 1)}
          className="text-xs px-2 py-1 rounded transition-all"
          style={{
            background: rate === 0.75 ? 'rgba(6,182,212,0.2)' : 'rgba(45,45,68,0.6)',
            border: `1px solid ${rate === 0.75 ? 'rgba(6,182,212,0.5)' : 'var(--border)'}`,
            color: rate === 0.75 ? 'var(--accent-glow)' : 'var(--muted)',
          }}
        >
          {rate === 1 ? '1×' : '0.75×'}
        </button>
      </div>

      <p className="text-sm text-center leading-relaxed max-w-xs" style={{ color: 'var(--muted)', fontFamily: 'Noto Sans, sans-serif' }}>
        {clip.contextSentence}
      </p>
    </motion.div>
  );
}
