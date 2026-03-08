const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface DocumentSummary {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  versions?: { id: string; content: string; version: number; createdAt: string }[];
}

export interface Version {
  id: string;
  documentId: string;
  content: string;
  version: number;
  createdAt: string;
}

export async function fetchDocuments(): Promise<DocumentSummary[]> {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchDocument(id: string): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents/${id}`);
  if (!res.ok) throw new Error('Failed to fetch document');
  return res.json();
}

export async function createDocument(title?: string, content?: string): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title || 'Untitled', content: content || '' }),
  });
  if (!res.ok) throw new Error('Failed to create document');
  return res.json();
}

export async function updateDocument(
  id: string,
  data: { title?: string; content?: string }
): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete document');
}

export async function fetchVersions(documentId: string): Promise<Version[]> {
  const res = await fetch(`${API_BASE}/documents/${documentId}/versions`);
  if (!res.ok) throw new Error('Failed to fetch versions');
  return res.json();
}
