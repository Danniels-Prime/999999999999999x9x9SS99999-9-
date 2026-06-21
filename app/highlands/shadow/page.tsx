'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import ShadowPlayer from '@/components/highlands/ShadowPlayer';
import GlowButton from '@/components/shared/GlowButton';
import { ArrowLeft } from 'lucide-react';

function ShadowContent() {
  const params = useSearchParams();
  const videoId = params.get('videoId');

  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="text-4xl">🎬</div>
        <div className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>No video selected</div>
        <Link href="/highlands">
          <GlowButton variant="ghost">← Back to Queue</GlowButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="cosmic-card p-4">
        <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--success)' }}>
          Shadowing Session Active
        </div>
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          🎯 Goal: Mimic the speaker exactly — tone, speed, rhythm, and emotion. This is how your brain builds a native accent.
        </div>
      </div>
      <ShadowPlayer videoId={videoId} />
    </div>
  );
}

export default function ShadowPage() {
  return (
    <PageWrapper className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/highlands" className="p-2 rounded-xl transition-colors hover:bg-[var(--surface-elevated)]">
          <ArrowLeft size={20} style={{ color: 'var(--muted)' }} />
        </Link>
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Shadow Session</h1>
      </div>
      <Suspense fallback={<div style={{ color: 'var(--muted)' }}>Loading...</div>}>
        <ShadowContent />
      </Suspense>
    </PageWrapper>
  );
}
