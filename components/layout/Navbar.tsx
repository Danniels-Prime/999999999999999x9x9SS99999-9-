'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Brain, Mountain, Sparkles, MessageSquare, Settings, Zap } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Zap },
  { href: '/neomonix', label: 'Neomonix', icon: Brain },
  { href: '/highlands', label: 'Highlands', icon: Mountain },
  { href: '/drills', label: 'Drills', icon: MessageSquare },
  { href: '/mindset', label: 'Mindset', icon: Sparkles },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col z-40 border-r border-[var(--border)]"
        style={{ background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">Neomonix</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Language OS</div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white'
                    : 'hover:bg-[var(--surface-elevated)]'
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.15))',
                  color: 'var(--primary-glow)',
                  boxShadow: '0 0 12px rgba(124,58,237,0.2)',
                } : { color: 'var(--muted)' }}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[var(--border)]">
          <div className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            🇷🇺 Learning Russian
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] flex"
        style={{ background: 'rgba(5,5,16,0.95)', backdropFilter: 'blur(20px)' }}>
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors"
              style={{ color: isActive ? 'var(--primary-glow)' : 'var(--muted)' }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
