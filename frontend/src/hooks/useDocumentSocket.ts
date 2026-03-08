'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

export interface DocumentUpdate {
  documentId: string;
  content: string;
  title?: string;
  from?: string;
}

export function useDocumentSocket(documentId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!documentId) return;
    const socket = io(`${WS_URL}/documents`, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-document', documentId);
    });
    socket.on('disconnect', () => setConnected(false));
    return () => {
      socket.emit('leave-document', documentId);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [documentId]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
    };
  }, [connect]);

  const sendEdit = useCallback(
    (content: string, title?: string) => {
      if (!documentId || !socketRef.current?.connected) return;
      socketRef.current.emit('edit', { documentId, content, title });
    },
    [documentId]
  );

  const subscribeToUpdates = useCallback((onUpdate: (data: DocumentUpdate) => void) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on('document-updated', onUpdate);
    return () => {
      socket.off('document-updated', onUpdate);
    };
  }, []);

  return { connected, sendEdit, subscribeToUpdates };
}
