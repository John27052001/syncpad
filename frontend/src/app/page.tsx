'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { fetchDocuments, createDocument, deleteDocument, type DocumentSummary } from '@/lib/api';
import { formatRelativeTime } from '@/lib/time';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const [docs, setDocs] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      const list = await fetchDocuments();
      setDocs(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const doc = await createDocument();
      window.location.href = `/documents/${doc.id}`;
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => (d.title || 'Untitled').toLowerCase().includes(q));
  }, [docs, query]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0d0d0d] dark:text-white">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0d0d0d]/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
              <svg className="h-5 w-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h5M6 3h9l3 3v15a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">SyncPad</div>
              <div className="text-xs text-gray-500 dark:text-white/50">Real-time collaborative docs</div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleCreate} disabled={creating} variant="primary">
              {creating ? 'Creating…' : 'New'}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-6">
          <div className="max-w-2xl">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Documents that sync instantly.
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-white/60">
              Open the same doc in multiple tabs (or share the URL) to see live updates and version history.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-sm">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents…"
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-white/50">
              {loading ? 'Loading…' : `${filtered.length} document${filtered.length === 1 ? '' : 's'}`}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-28 animate-pulse bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : docs.length === 0 ? (
          <Card className="border-dashed p-10 bg-gray-50 dark:bg-white/5">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20">
                <svg className="h-6 w-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Create your first document</div>
              <div className="mt-1 text-sm text-gray-600 dark:text-white/60">
                Start writing, then open the same link elsewhere to collaborate.
              </div>
              <div className="mt-6">
                <Button onClick={handleCreate} disabled={creating} variant="primary" size="lg">
                  {creating ? 'Creating…' : 'New document'}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc) => (
              <Link key={doc.id} href={`/documents/${doc.id}`}>
                <Card className="group p-4 transition bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {doc.title || 'Untitled'}
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-white/50">
                        Updated {formatRelativeTime(doc.updatedAt)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, doc.id)}
                      className="rounded-lg border border-transparent p-2 text-gray-500 opacity-0 transition hover:border-gray-300 hover:bg-gray-200 hover:text-red-500 dark:hover:border-neutral-700 dark:hover:bg-white/10 dark:hover:text-red-300 group-hover:opacity-100"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-white/40">
                    <div className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500/70" />
                      Live sync enabled
                    </div>
                    <span className="text-gray-400 dark:text-white/30">Open →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
