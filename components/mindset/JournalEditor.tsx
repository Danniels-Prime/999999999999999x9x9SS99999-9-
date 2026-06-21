'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import GlowButton from '@/components/shared/GlowButton';

interface JournalEditorProps {
  initialContent?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (content: string) => Promise<any>;
}

export default function JournalEditor({ initialContent = '', onSave }: JournalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await onSave(content);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="cosmic-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Today's Journal
        </div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {content.length} chars
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind today? How is your Russian journey going? Write freely — this is your space..."
        rows={8}
        className="w-full resize-none outline-none rounded-xl p-4 text-sm leading-relaxed transition-colors"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      />

      <GlowButton
        onClick={handleSave}
        disabled={saving || !content.trim()}
        variant={saved ? 'accent' : 'primary'}
        className="flex items-center gap-2"
      >
        <Save size={15} />
        {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Entry'}
      </GlowButton>
    </div>
  );
}
