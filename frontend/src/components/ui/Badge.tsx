'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'warning';
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-white/5 text-white/70 border-white/10',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
};

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

