'use client';

import { useMemo } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import AffirmationCard from '@/components/mindset/AffirmationCard';
import AwarenessPrompt from '@/components/mindset/AwarenessPrompt';
import JournalEditor from '@/components/mindset/JournalEditor';
import { useJournal } from '@/lib/hooks/useJournal';
import { affirmations, awarenessPrompts } from '@/lib/seed/affirmations';
import { Sparkles } from 'lucide-react';
import { todayISO } from '@/lib/utils/date';
import { formatDate } from '@/lib/utils/date';

function getDailyIndex(list: unknown[], date: string): number {
  const dayOfYear = Math.floor(
    (new Date(date).getTime() - new Date(new Date(date).getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return dayOfYear % list.length;
}

export default function MindsetPage() {
  const { todayEntry, entries, loading, save } = useJournal();
  const today = todayISO();

  const todayAffirmation = useMemo(() => affirmations[getDailyIndex(affirmations, today)], [today]);
  const todayPrompt = useMemo(() => awarenessPrompts[getDailyIndex(awarenessPrompts, today)], [today]);

  return (
    <PageWrapper className="p-6 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={24} style={{ color: 'var(--gold)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Mindset</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Inner work powers outer results. Strengthen your mind alongside your language.
        </p>
      </div>

      <div className="space-y-6">
        <AffirmationCard affirmation={todayAffirmation} />
        <AwarenessPrompt prompt={todayPrompt} />
        <JournalEditor
          initialContent={todayEntry?.content ?? ''}
          onSave={save}
        />

        {/* Past entries */}
        {entries.length > 1 && (
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Past Entries
            </div>
            {entries.filter((e) => e.date !== today).slice(0, 5).map((entry) => (
              <div key={entry.id} className="cosmic-card p-4 space-y-2">
                <div className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  {formatDate(entry.date)}
                </div>
                <div
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
