'use client';

import PageWrapper from '@/components/layout/PageWrapper';
import StreakCard from '@/components/dashboard/StreakCard';
import QuickStats from '@/components/dashboard/QuickStats';
import DailyMission from '@/components/dashboard/DailyMission';
import { useProgress } from '@/lib/hooks/useProgress';
import { useWords } from '@/lib/hooks/useWords';
import { usePhrases } from '@/lib/hooks/usePhrases';
import { useVideos } from '@/lib/hooks/useVideos';
import { useJournal } from '@/lib/hooks/useJournal';
import { getDueCards } from '@/lib/srs/sm2';

export default function DashboardPage() {
  const { progress, loading: pLoading } = useProgress();
  const { words } = useWords('ru');
  const { phrases } = usePhrases('ru');
  const { videos } = useVideos('ru');
  const { todayEntry } = useJournal();

  const dueCards = getDueCards(words).length;
  const phrasesLearning = phrases.filter((p) => p.drillStatus === 'learning').length;
  const videosQueued = videos.filter((v) => v.watchStatus === 'unwatched' || v.watchStatus === 'in-progress').length;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  if (pLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg animate-pulse-glow" style={{ color: 'var(--primary-glow)' }}>
          Loading your universe...
        </div>
      </div>
    );
  }

  return (
    <PageWrapper className="p-6 max-w-4xl">
      <div className="mb-8">
        <div className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
          {greeting} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl font-bold shimmer-text">
          Ready to expand your mind?
        </h1>
        <div className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          🇷🇺 Russian · Day {progress.streakDays > 0 ? progress.streakDays : 1} of your journey
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StreakCard
            streakDays={progress.streakDays}
            todayXP={progress.todayXP}
            dailyGoalXP={progress.settings.dailyGoalXP}
          />
          <div className="sm:col-span-2">
            <QuickStats progress={progress} dueCards={dueCards} />
          </div>
        </div>

        <DailyMission
          dueCards={dueCards}
          phrasesLearning={phrasesLearning}
          videosQueued={videosQueued}
          hasTodayJournal={!!todayEntry}
        />

        <div
          className="rounded-2xl p-5 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div className="text-2xl mb-2">🧠</div>
          <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Every word you review is a new neural pathway forged.
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Your brain is rewiring itself right now.
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
