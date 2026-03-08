'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-border bg-white/5 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  );
}

