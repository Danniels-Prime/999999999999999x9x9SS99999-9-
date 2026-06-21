'use client';

import Link from 'next/link';
import { Brain, Mountain, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';

interface DailyMissionProps {
  dueCards: number;
  phrasesLearning: number;
  videosQueued: number;
  hasTodayJournal: boolean;
}

export default function DailyMission({ dueCards, phrasesLearning, videosQueued, hasTodayJournal }: DailyMissionProps) {
  const missions = [
    {
      href: '/neomonix/study',
      icon: Brain,
      title: 'Neomonix Session',
      desc: dueCards > 0 ? `${dueCards} cards due for review` : 'Start with new vocabulary',
      done: false,
      color: 'var(--primary-glow)',
      priority: dueCards > 0,
    },
    {
      href: '/drills',
      icon: MessageSquare,
      title: 'Phrase Drills',
      desc: phrasesLearning > 0 ? `${phrasesLearning} phrases in progress` : 'Practice essential phrases',
      done: false,
      color: 'var(--accent)',
      priority: false,
    },
    {
      href: '/highlands',
      icon: Mountain,
      title: 'Language Highlands',
      desc: videosQueued > 0 ? `${videosQueued} videos in queue` : 'Add a video to shadow',
      done: videosQueued === 0,
      color: 'var(--success)',
      priority: false,
    },
    {
      href: '/mindset',
      icon: Sparkles,
      title: 'Mindset Check-in',
      desc: hasTodayJournal ? "Today's entry saved" : "Write today's reflection",
      done: hasTodayJournal,
      color: 'var(--gold)',
      priority: false,
    },
  ];

  return (
    <div className="cosmic-card p-5 space-y-1">
      <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>
        Today's Mission
      </div>
      {missions.map(({ href, icon: Icon, title, desc, done, color, priority }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] group"
          style={{ background: priority ? 'rgba(124,58,237,0.08)' : 'var(--surface)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            {done
              ? <span className="text-base">✓</span>
              : <Icon size={18} style={{ color }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: done ? 'var(--muted)' : 'var(--foreground)', textDecoration: done ? 'line-through' : 'none' }}>
              {title}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</div>
          </div>
          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--muted)' }} />
        </Link>
      ))}
    </div>
  );
}
