'use client';

import { cn } from '@/lib/utils/cn';
import { type ButtonHTMLAttributes } from 'react';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses = {
  primary: 'bg-[var(--primary)] hover:bg-[var(--primary-glow)] text-white border border-[var(--primary)] hover:glow-purple',
  accent: 'bg-[var(--accent)] hover:bg-[var(--accent-glow)] text-black border border-[var(--accent)] hover:glow-cyan',
  gold: 'bg-[var(--gold)] hover:bg-[var(--gold-glow)] text-black border border-[var(--gold)] hover:glow-gold',
  ghost: 'bg-transparent hover:bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border)]',
  danger: 'bg-[var(--danger)] hover:bg-red-400 text-white border border-[var(--danger)]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export default function GlowButton({ variant = 'primary', size = 'md', className, children, ...props }: GlowButtonProps) {
  return (
    <button
      className={cn(
        'font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
