'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';

export interface DrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({ open, title, onClose, children, footer }: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-30 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-md border-l border-surface-border bg-[hsl(var(--surface))] shadow-2xl transition-transform',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-surface-border px-4 py-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{title}</div>
              <div className="text-xs text-white/50">Press Esc to close</div>
            </div>
            <IconButton label="Close" onClick={onClose}>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>

          <div className="flex-1 overflow-auto px-4 py-4">{children}</div>
          {footer ? (
            <div className="border-t border-surface-border px-4 py-3">{footer}</div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

