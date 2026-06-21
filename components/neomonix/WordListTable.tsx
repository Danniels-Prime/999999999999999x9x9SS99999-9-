'use client';

import { useState, useMemo } from 'react';
import type { VocabCard, SRSLevel } from '@/lib/types';
import { formatRelative } from '@/lib/utils/date';
import { Search } from 'lucide-react';

interface WordListTableProps {
  words: VocabCard[];
}

const levelBadge: Record<SRSLevel, string> = {
  new: 'badge-new',
  learning: 'badge-learning',
  review: 'badge-review',
  mastered: 'badge-mastered',
};

export default function WordListTable({ words }: WordListTableProps) {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<SRSLevel | 'all'>('all');

  const filtered = useMemo(() => {
    return words.filter((w) => {
      const matchSearch = search
        ? w.word.includes(search) ||
          w.translation.toLowerCase().includes(search.toLowerCase()) ||
          w.romanization.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchLevel = filterLevel === 'all' || w.srsLevel === filterLevel;
      return matchSearch && matchLevel;
    });
  }, [words, search, filterLevel]);

  const levels: (SRSLevel | 'all')[] = ['all', 'new', 'learning', 'review', 'mastered'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                background: filterLevel === level ? 'var(--primary)' : 'var(--surface-elevated)',
                color: filterLevel === level ? 'white' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
        {filtered.length} of {words.length} words
      </div>

      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--muted)' }}>#</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--muted)' }}>Word</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: 'var(--muted)' }}>Pronunciation</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--muted)' }}>Meaning</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: 'var(--muted)' }}>Level</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: 'var(--muted)' }}>Next Review</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((word, i) => (
                <tr
                  key={word.id}
                  className="transition-colors"
                  style={{
                    background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-elevated)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <td className="px-4 py-3" style={{ color: 'var(--muted)' }}>{word.frequency}</td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: 'Noto Sans, sans-serif', fontWeight: 600, color: 'var(--foreground)' }}>
                      {word.word}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell" style={{ color: 'var(--muted)' }}>
                    /{word.romanization}/
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>
                    {word.translation}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`${levelBadge[word.srsLevel]} text-xs px-2 py-0.5 rounded-full font-medium`}>
                      {word.srsLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs" style={{ color: 'var(--muted)' }}>
                    {formatRelative(word.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
