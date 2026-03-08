'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, label, ...props }, ref) {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--surface))] disabled:opacity-50 disabled:pointer-events-none',
          className,
        )}
        {...props}
      />
    );
  },
);

