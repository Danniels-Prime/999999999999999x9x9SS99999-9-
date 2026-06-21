'use client';

import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import WordListTable from '@/components/neomonix/WordListTable';
import GlowButton from '@/components/shared/GlowButton';
import { useWords } from '@/lib/hooks/useWords';
import { getDueCards } from '@/lib/srs/sm2';
import { Brain, Play } from 'lucide-react';
import type { SRSLevel } from '@/lib/types';

const levelColors: Record<SRSLevel, string> = {
  new: 'var(--muted)',
  learning: 'var(--gold)',
  review: 'var(--primary-glow)',
  mastered: 'var(--success)',
};

export default function NeomonixPage() {
  const { words, loading } = useWords('ru');

  const dueCards = getDueCards(words).length;
  const levelCounts = words.reduce((acc, w) => {
    acc[w.srsLevel] = (acc[w.srsLevel] || 0) + 1;
    return acc;
  }, {} as Record<SRSLevel, number>);

  return (
    <PageWrapper className="p-6 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={24} style={{ color: 'var(--primary-glow)' }} />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Neomonix</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Mnemonic spaced repetition — the fastest path to vocabulary mastery
          </p>
        </div>
        <Link href="/neomonix/study">
          <GlowButton size="lg" className="flex items-center gap-2">
            <Play size={16} />
            {dueCards > 0 ? `Study ${dueCards} Due Cards` : 'Start Session'}
          </GlowButton>
        </Link>
      </div>

      {/* Level overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {(['new', 'learning', 'review', 'mastered'] as SRSLevel[]).map((level) => (
          <div key={level} className="cosmic-card p-4">
            <div className="text-2xl font-bold" style={{ color: levelColors[level] }}>
              {levelCounts[level] ?? 0}
            </div>
            <div className="text-xs mt-1 capitalize" style={{ color: 'var(--muted)' }}>{level}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>Loading vocabulary...</div>
      ) : (
        <WordListTable words={words} />
      )}
    </PageWrapper>
  );
}
