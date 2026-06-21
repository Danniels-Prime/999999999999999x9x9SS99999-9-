'use client';

import { useState, useMemo } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import DrillSession from '@/components/drills/DrillSession';
import GlowButton from '@/components/shared/GlowButton';
import { usePhrases } from '@/lib/hooks/usePhrases';
import { MessageSquare, RotateCcw, Trophy } from 'lucide-react';
import type { Phrase, PhraseCategory } from '@/lib/types';
import { PHRASE_CATEGORIES } from '@/lib/types';
import { useProgress } from '@/lib/hooks/useProgress';

type DrillState = 'setup' | 'drilling' | 'complete';

export default function DrillsPage() {
  const { progress } = useProgress();
  const { phrases, loading, updateStatus } = usePhrases('ru');
  const [direction, setDirection] = useState<'ru-en' | 'en-ru'>('ru-en');
  const [category, setCategory] = useState<PhraseCategory | 'all'>('all');
  const [drillState, setDrillState] = useState<DrillState>('setup');
  const [results, setResults] = useState<{ known: number; learning: number } | null>(null);

  const sessionPhrases = useMemo(() => {
    const filtered = category === 'all'
      ? phrases
      : phrases.filter((p) => p.category === category);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, progress.settings.drillsPerSession);
  }, [phrases, category, progress.settings.drillsPerSession]);

  const handleFinish = (res: { known: number; learning: number }) => {
    setResults(res);
    setDrillState('complete');
  };

  const restart = () => {
    setDrillState('setup');
    setResults(null);
  };

  const categories = [
    { value: 'all' as const, label: 'All Phrases' },
    ...Object.entries(PHRASE_CATEGORIES).map(([k, v]) => ({ value: k as PhraseCategory, label: v })),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-glow" style={{ color: 'var(--accent)' }}>Loading phrases...</div>
      </div>
    );
  }

  return (
    <PageWrapper className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={24} style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Phrase Drills</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Back and forth — the most essential phrases, drilled until they're instinct
        </p>
      </div>

      {drillState === 'setup' && (
        <div className="space-y-6">
          {/* Direction toggle */}
          <div className="cosmic-card p-5 space-y-3">
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Direction</div>
            <div className="flex gap-2">
              {(['ru-en', 'en-ru'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDirection(d)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: direction === d ? 'var(--accent)' : 'var(--surface)',
                    color: direction === d ? 'black' : 'var(--muted)',
                    border: `1px solid ${direction === d ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {d === 'ru-en' ? '🇷🇺 → 🇬🇧' : '🇬🇧 → 🇷🇺'}
                </button>
              ))}
            </div>
          </div>

          {/* Category select */}
          <div className="cosmic-card p-5 space-y-3">
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Category</div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {categories.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{
                    background: category === value ? 'var(--primary)' : 'var(--surface)',
                    color: category === value ? 'white' : 'var(--muted)',
                    border: `1px solid ${category === value ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm" style={{ color: 'var(--muted)' }}>
            <span>{sessionPhrases.length} phrases selected</span>
          </div>

          <GlowButton
            size="lg"
            className="w-full"
            disabled={sessionPhrases.length === 0}
            onClick={() => setDrillState('drilling')}
          >
            Start Drill Session →
          </GlowButton>
        </div>
      )}

      {drillState === 'drilling' && (
        <DrillSession
          phrases={sessionPhrases}
          direction={direction}
          onUpdateStatus={updateStatus}
          onFinish={handleFinish}
        />
      )}

      {drillState === 'complete' && results && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="text-5xl">🎯</div>
          <h2 className="text-2xl font-bold shimmer-text">Drill Complete!</h2>
          <div className="cosmic-card p-6 w-full space-y-3">
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted)' }}>Known</span>
              <span className="font-bold" style={{ color: 'var(--success)' }}>{results.known} ✓</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted)' }}>Still Learning</span>
              <span className="font-bold" style={{ color: 'var(--gold)' }}>{results.learning} →</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--muted)' }}>Accuracy</span>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>
                {Math.round((results.known / (results.known + results.learning)) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <GlowButton onClick={restart} className="flex items-center gap-2">
              <RotateCcw size={15} /> Drill Again
            </GlowButton>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
