'use client';

import type { AwarenessPrompt as AwarenessPromptType } from '@/lib/types';

interface AwarenessPromptProps {
  prompt: AwarenessPromptType;
}

export default function AwarenessPrompt({ prompt }: AwarenessPromptProps) {
  return (
    <div className="cosmic-card p-6 space-y-3" style={{ border: '1px solid rgba(6,182,212,0.2)' }}>
      <div className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        Awareness Prompt
      </div>
      <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--foreground)' }}>
        {prompt.question}
      </p>
      {prompt.hint && (
        <p className="text-sm" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
          💡 {prompt.hint}
        </p>
      )}
    </div>
  );
}
