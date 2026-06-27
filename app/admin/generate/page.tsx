'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PageWrapper from '@/components/layout/PageWrapper';
import GlowButton from '@/components/shared/GlowButton';
import { putWord } from '@/lib/db/words';
import type { VocabCard, PartOfSpeech } from '@/lib/types';
import type { MnemonicContent } from '@/lib/claudeApi';
import { todayISO } from '@/lib/utils/date';

const ADMIN_PW_KEY = 'hq_admin_pw';

interface WordInput {
  word: string;
  translation: string;
  romanization: string;
}

interface GeneratedRow extends WordInput {
  result?: MnemonicContent;
  error?: string;
  loading?: boolean;
  imageUrl?: string;
  saved?: boolean;
}

export default function AdminGeneratePage() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [batchText, setBatchText] = useState('');
  const [rows, setRows] = useState<GeneratedRow[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_PW_KEY);
    if (stored) setAuthed(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem(ADMIN_PW_KEY, pwInput);
    setAuthed(true);
  };

  const generateOne = async (index: number, row: GeneratedRow): Promise<void> => {
    setRows((prev) => prev.map((r, i) => i === index ? { ...r, loading: true, error: undefined } : r));
    try {
      const pw = localStorage.getItem(ADMIN_PW_KEY) ?? '';
      const res = await fetch('/api/admin/generate-mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({ word: row.word, translation: row.translation, romanization: row.romanization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setRows((prev) => prev.map((r, i) => i === index ? { ...r, loading: false, result: data as MnemonicContent } : r));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setRows((prev) => prev.map((r, i) => i === index ? { ...r, loading: false, error: msg } : r));
    }
  };

  const generateAll = async () => {
    let parsed: WordInput[];
    try {
      parsed = JSON.parse(batchText);
      if (!Array.isArray(parsed)) throw new Error('Must be an array');
    } catch {
      alert('Invalid JSON. Paste an array like [{"word":"...", "translation":"...", "romanization":"..."}]');
      return;
    }
    const initial: GeneratedRow[] = parsed.map((p) => ({ ...p, loading: false }));
    setRows(initial);
    for (let i = 0; i < initial.length; i++) {
      await generateOne(i, initial[i]);
    }
  };

  const saveRow = async (index: number) => {
    const row = rows[index];
    if (!row.result) return;
    const now = new Date().toISOString();
    const card: VocabCard = {
      id: uuidv4(),
      languageCode: 'ru',
      word: row.word,
      romanization: row.romanization,
      translation: row.translation,
      partOfSpeech: 'other' as PartOfSpeech,
      frequency: 999,
      mnemonicStory: row.result.phoneticHook,
      phoneticHook: row.result.phoneticHook,
      mnemonicImage: row.imageUrl || undefined,
      exampleSentences: [{ sentence: row.result.contextSentence.ru, translation: row.result.contextSentence.en }],
      tags: ['admin-generated'],
      srsLevel: 'new',
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: todayISO(),
      createdAt: now,
      updatedAt: now,
    };
    await putWord(card);
    setRows((prev) => prev.map((r, i) => i === index ? { ...r, saved: true } : r));
  };

  if (!authed) {
    return (
      <PageWrapper className="p-6 max-w-sm mx-auto flex flex-col gap-4 mt-20">
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Admin Access</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={pwInput}
          onChange={(e) => setPwInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="cosmic-card px-4 py-2 text-sm outline-none w-full"
          style={{ color: 'var(--foreground)', background: 'var(--surface-elevated)' }}
        />
        <GlowButton onClick={handleLogin}>Enter</GlowButton>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>Content Pipeline</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Paste a JSON array of words → generate phonetic hooks, image concepts, and context sentences via Claude.
        </p>
      </div>

      <div className="cosmic-card p-4 mb-6">
        <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Batch Input (JSON array)
        </div>
        <textarea
          value={batchText}
          onChange={(e) => setBatchText(e.target.value)}
          placeholder={'[{"word":"Привет","translation":"Hello","romanization":"Privet"}]'}
          rows={5}
          className="w-full text-sm outline-none resize-y font-mono"
          style={{
            background: 'var(--surface)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '0.75rem',
          }}
        />
        <div className="mt-3">
          <GlowButton onClick={generateAll}>Generate All</GlowButton>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="space-y-4">
          {rows.map((row, i) => (
            <div key={i} className="cosmic-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-lg" style={{ fontFamily: 'Noto Sans, sans-serif', color: 'var(--foreground)' }}>
                    {row.word}
                  </span>
                  <span className="text-sm ml-2" style={{ color: 'var(--muted)' }}>
                    {row.romanization} · {row.translation}
                  </span>
                </div>
                {!row.result && !row.loading && (
                  <button
                    onClick={() => generateOne(i, row)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ background: 'rgba(124,58,237,0.2)', color: 'var(--primary-glow)', border: '1px solid rgba(168,85,247,0.3)' }}
                  >
                    Retry
                  </button>
                )}
              </div>

              {row.loading && (
                <div className="text-sm animate-pulse-glow" style={{ color: 'var(--primary-glow)' }}>
                  Generating...
                </div>
              )}

              {row.error && (
                <div className="text-sm" style={{ color: 'var(--danger)' }}>{row.error}</div>
              )}

              {row.result && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--primary-glow)', opacity: 0.7 }}>
                      Phonetic Hook
                    </div>
                    <div className="text-sm italic" style={{ color: 'var(--foreground)' }}>{row.result.phoneticHook}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Image Concepts</div>
                    {row.result.imageConcepts.map((c, ci) => (
                      <div key={ci} className="text-sm pl-3" style={{ color: 'var(--foreground)', borderLeft: '2px solid var(--border)' }}>
                        {ci + 1}. {c}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent-glow)', opacity: 0.7 }}>
                      Image Prompt (Midjourney/DALL-E)
                    </div>
                    <div className="text-sm font-mono" style={{ color: 'var(--foreground)' }}>{row.result.imagePrompt}</div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                    <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Context Sentence</div>
                    <div className="text-sm" style={{ fontFamily: 'Noto Sans, sans-serif', color: 'var(--foreground)' }}>
                      {row.result.contextSentence.ru}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{row.result.contextSentence.en}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      placeholder="Paste image URL (after generating in Midjourney/DALL-E)"
                      value={row.imageUrl ?? ''}
                      onChange={(e) => setRows((prev) => prev.map((r, ri) => ri === i ? { ...r, imageUrl: e.target.value } : r))}
                      className="flex-1 text-sm px-3 py-1.5 rounded outline-none"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        borderRadius: '8px',
                      }}
                    />
                    {row.saved ? (
                      <span className="text-sm" style={{ color: 'var(--success)' }}>Saved</span>
                    ) : (
                      <GlowButton size="sm" onClick={() => saveRow(i)}>Save to DB</GlowButton>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
