'use client';

import { useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import GlowButton from '@/components/shared/GlowButton';
import { useProgress } from '@/lib/hooks/useProgress';
import { exportAllData, downloadJSON, importData } from '@/lib/utils/export';
import { Settings, Download, Upload, RotateCcw } from 'lucide-react';

export default function SettingsPage() {
  const { progress, updateSettings } = useProgress();
  const [exporting, setExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'done' | 'error'>('idle');

  const handleExport = async () => {
    setExporting(true);
    const data = await exportAllData();
    downloadJSON(data, `neomonix-backup-${new Date().toISOString().split('T')[0]}.json`);
    setExporting(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus('importing');
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        await importData(ev.target?.result as string);
        setImportStatus('done');
        setTimeout(() => setImportStatus('idle'), 2000);
      } catch {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 2000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <PageWrapper className="p-6 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={24} style={{ color: 'var(--muted)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Settings</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Study Settings */}
        <div className="cosmic-card p-6 space-y-5">
          <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Study Preferences</div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm" style={{ color: 'var(--foreground)' }}>Show Romanization</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Display pronunciation under Russian words</div>
            </div>
            <button
              onClick={() => updateSettings({ showRomanization: !progress.settings.showRomanization })}
              className="relative w-11 h-6 rounded-full transition-all cursor-pointer"
              style={{ background: progress.settings.showRomanization ? 'var(--primary)' : 'var(--border)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
                style={{ left: progress.settings.showRomanization ? '22px' : '2px' }}
              />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: 'var(--foreground)' }}>Cards per Session</div>
              <span className="text-sm font-bold" style={{ color: 'var(--primary-glow)' }}>{progress.settings.cardsPerSession}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={progress.settings.cardsPerSession}
              onChange={(e) => updateSettings({ cardsPerSession: Number(e.target.value) })}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>5</span><span>50</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: 'var(--foreground)' }}>Drills per Session</div>
              <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{progress.settings.drillsPerSession}</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={progress.settings.drillsPerSession}
              onChange={(e) => updateSettings({ drillsPerSession: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>5</span><span>30</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: 'var(--foreground)' }}>Daily XP Goal</div>
              <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{progress.settings.dailyGoalXP}</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={progress.settings.dailyGoalXP}
              onChange={(e) => updateSettings({ dailyGoalXP: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Data */}
        <div className="cosmic-card p-6 space-y-4">
          <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Data Management</div>

          <div className="flex gap-3 flex-wrap">
            <GlowButton
              variant="ghost"
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2"
            >
              <Download size={15} />
              {exporting ? 'Exporting...' : 'Export Backup'}
            </GlowButton>

            <label className="cursor-pointer">
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              <span
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-medium transition-all duration-200 border cursor-pointer"
                style={{
                  background: 'transparent',
                  color: importStatus === 'done' ? 'var(--success)' : importStatus === 'error' ? 'var(--danger)' : 'var(--foreground)',
                  borderColor: 'var(--border)',
                }}
              >
                <Upload size={15} />
                {importStatus === 'importing' ? 'Importing...'
                  : importStatus === 'done' ? 'Imported!'
                  : importStatus === 'error' ? 'Error!'
                  : 'Import Backup'}
              </span>
            </label>
          </div>

          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            All data is stored locally in your browser. Export regularly to keep backups.
          </div>
        </div>

        {/* Stats */}
        <div className="cosmic-card p-6 space-y-3">
          <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Your Journey</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div style={{ color: 'var(--muted)' }}>Language</div>
              <div className="font-medium" style={{ color: 'var(--foreground)' }}>🇷🇺 Russian</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>Streak</div>
              <div className="font-medium" style={{ color: 'var(--gold)' }}>🔥 {progress.streakDays} days</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>Total XP</div>
              <div className="font-medium" style={{ color: 'var(--primary-glow)' }}>⚡ {progress.totalXP}</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)' }}>Cards Learned</div>
              <div className="font-medium" style={{ color: 'var(--accent)' }}>📚 {progress.totalCardsLearned}</div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
