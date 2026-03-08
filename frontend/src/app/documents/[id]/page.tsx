'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchDocument, updateDocument, fetchVersions, type Document as DocType, type Version } from '@/lib/api';
import { useDocumentSocket } from '@/hooks/useDocumentSocket';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { RichEditor } from '@/components/editor/RichEditor';
import { stripHtmlToText, countWords } from '@/lib/text';
import { formatRelativeTime } from '@/lib/time';

export default function DocumentPage() {
  const params = useParams();
  const id = params?.id as string;
  const [doc, setDoc] = useState<DocType | null>(null);
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState<Version[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const localContentRef = useRef('');
  const localTitleRef = useRef('');
  const isRemoteUpdateRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { connected, sendEdit, subscribeToUpdates } = useDocumentSocket(id || null);

  const loadDoc = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchDocument(id);
      setDoc(data);
      localContentRef.current = data.content;
      localTitleRef.current = data.title || '';
    } catch (e) {
      console.error(e);
      setDoc(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDoc();
  }, [loadDoc]);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToUpdates((data) => {
      if (data.documentId !== id) return;
      isRemoteUpdateRef.current = true;
      setDoc((prev) =>
        prev
          ? {
              ...prev,
              content: data.content,
              ...(data.title != null && { title: data.title }),
            }
          : null
      );
      localContentRef.current = data.content;
      if (data.title != null) localTitleRef.current = data.title;
    });
    return unsub;
  }, [id, subscribeToUpdates]);

  const persistContent = useCallback(
    (content: string, title?: string) => {
      if (!id) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaving(true);
      debounceRef.current = setTimeout(async () => {
        try {
          await updateDocument(id, { content, ...(title != null && { title }) });
          setLastSavedAt(new Date());
        } catch (e) {
          console.error(e);
        } finally {
          setSaving(false);
        }
        debounceRef.current = null;
      }, 400);
    },
    [id]
  );

  const handleContentChange = useCallback(
    (html: string) => {
      if (isRemoteUpdateRef.current) {
        isRemoteUpdateRef.current = false;
        return;
      }
      localContentRef.current = html;
      setDoc((prev) => (prev ? { ...prev, content: html } : null));
      sendEdit(html, localTitleRef.current || undefined);
      persistContent(html);
    },
    [sendEdit, persistContent]
  );

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      localTitleRef.current = value;
      setDoc((prev) => (prev ? { ...prev, title: value } : null));
      sendEdit(localContentRef.current, value);
      persistContent(localContentRef.current, value);
    },
    [sendEdit, persistContent]
  );

  const loadVersions = useCallback(async () => {
    if (!id) return;
    try {
      const list = await fetchVersions(id);
      setVersions(list);
      setShowHistory(true);
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  const stats = useMemo(() => {
    const text = stripHtmlToText(doc?.content || '');
    return { words: countWords(text), chars: text.length };
  }, [doc?.content]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const restoreVersion = async (v: Version) => {
    if (!id) return;
    if (!confirm(`Restore to version ${v.version}? This will overwrite the current document content.`)) return;
    const html = v.content;
    localContentRef.current = html;
    setDoc((prev) => (prev ? { ...prev, content: html } : prev));
    sendEdit(html, localTitleRef.current || undefined);
    try {
      setSaving(true);
      await updateDocument(id, { content: html });
      setLastSavedAt(new Date());
      setShowHistory(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[hsl(var(--foreground-muted))]">Loading…</div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[hsl(var(--foreground-muted))]">Document not found.</p>
        <Link href="/" className="text-accent hover:underline">
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-surface-border bg-[hsl(var(--surface))]/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-6 py-3">
          <Link
            href="/"
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
            aria-label="Back"
            title="Back"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="min-w-0 flex-1">
            <input
              type="text"
              value={doc.title}
              onChange={handleTitleChange}
              className="w-full min-w-0 bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/40"
              placeholder="Untitled"
            />
            <div className="mt-0.5 text-xs text-white/45">
              {saving ? 'Saving…' : lastSavedAt ? `Saved ${formatRelativeTime(lastSavedAt)}` : ' '}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone={connected ? 'success' : 'warning'}>
              <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {connected ? 'Connected' : 'Offline'}
            </Badge>
            <ThemeToggle />
            <IconButton label="Copy link" onClick={handleCopyLink} type="button">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 8h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </IconButton>
            <Button onClick={loadVersions} variant="secondary" size="sm">
              History
            </Button>
          </div>
        </div>
        {copied ? (
          <div className="mx-auto max-w-5xl px-6 pb-3">
            <div className="text-xs text-accent/90">Link copied.</div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <RichEditor value={doc.content} onChange={handleContentChange} />
        <div className="mt-4 flex items-center justify-between text-xs text-white/45">
          <div className="flex items-center gap-3">
            <span>{stats.words} words</span>
            <span className="text-white/25">·</span>
            <span>{stats.chars} chars</span>
          </div>
          <div className="text-white/35">Edits sync live while connected</div>
        </div>
      </main>

      <Drawer open={showHistory} title="Version history" onClose={() => setShowHistory(false)}>
        <div className="space-y-3">
          {versions.map((v) => {
            const preview = stripHtmlToText(v.content).slice(0, 140);
            return (
              <div key={v.id} className="rounded-xl border border-surface-border bg-white/5 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">Version {v.version}</div>
                    <div className="mt-0.5 text-xs text-white/50">
                      {new Date(v.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => restoreVersion(v)}>
                    Restore
                  </Button>
                </div>
                <div className="mt-3 whitespace-pre-wrap text-xs text-white/55">
                  {preview || '—'}
                  {preview.length >= 140 ? '…' : ''}
                </div>
              </div>
            );
          })}
          {versions.length === 0 ? (
            <div className="text-sm text-white/60">No versions yet.</div>
          ) : null}
        </div>
      </Drawer>
    </div>
  );
}
