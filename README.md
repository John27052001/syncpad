# SyncPad — Real-Time Collaborative Document Editor

Full-stack, production-grade real-time collaboration: multiple users edit documents simultaneously with instant sync, version history, and conflict-free synchronization.

## What it does

- **Create, edit, and collaborate** on documents in real time
- **Every keystroke** syncs instantly across all connected clients
- **Automatic versioning** stores every change as a new snapshot (history + rollback)
- **Backend** ensures consistency, ordering, and persistence
- **Frontend** provides a clean, Linear/Notion-style editor

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 14, React 19, Tailwind CSS, Socket.IO client |
| Backend | NestJS, Prisma 7, PostgreSQL, WebSocket Gateway (Socket.IO) |
| Data | PostgreSQL for documents + versions |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                              │
│  Renders editor, sends edits over WebSockets, receives updates   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP REST + WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│  Backend (NestJS)                                                │
│  WebSocket Gateway: rooms, broadcast | REST: CRUD, versions     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│  Prisma + PostgreSQL                                             │
│  Documents, Versions, timestamps                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick start

### 1. PostgreSQL

Have PostgreSQL running locally (e.g. Docker):

```bash
docker run -d --name syncpad-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=syncpad -p 5432:5432 postgres:16
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set DATABASE_URL and optional PORT, FRONTEND_URL
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend runs at **http://localhost:4000** (API + WebSocket).

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# Optional: set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WS_URL if not localhost:4000
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**.

### 4. Try it

- Open http://localhost:3000, create a document.
- Open the same document in another tab (or share the URL). Edit in one tab and see changes in the other in real time.
- Use **History** to see version snapshots.

## Project layout

```
syncpad/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Document, Version models
│   └── src/
│       ├── documents/       # Module: controller, service, gateway, DTOs
│       ├── prisma/          # PrismaService
│       ├── app.module.ts
│       └── main.ts
├── frontend/
│   └── src/
│       ├── app/             # App Router: list, document editor
│       ├── components/
│       ├── hooks/           # useDocumentSocket
│       └── lib/             # API client
└── README.md
```

## API (REST)

- `GET /documents` — List documents
- `POST /documents` — Create document (`title`, `content` optional)
- `GET /documents/:id` — Get document
- `PATCH /documents/:id` — Update document (`title`, `content`)
- `GET /documents/:id/versions` — List versions
- `DELETE /documents/:id` — Delete document

## WebSocket (Socket.IO namespace `/documents`)

- **Client → Server**
  - `join-document` (documentId) — Join room for a document
  - `leave-document` (documentId) — Leave room
  - `edit` ({ documentId, content, title? }) — Persist and broadcast edit
- **Server → Client**
  - `document-updated` ({ documentId, content, title?, from }) — Another user edited

## Environment

**Backend (`.env`)**

- `DATABASE_URL` — PostgreSQL connection string (required)
- `PORT` — HTTP/WS server port (default 4000)
- `FRONTEND_URL` — CORS origin for API and WS (default http://localhost:3000)

**Frontend (`.env.local`)**

- `NEXT_PUBLIC_API_URL` — Backend URL (default http://localhost:4000)
- `NEXT_PUBLIC_WS_URL` — Backend URL for WebSocket (default http://localhost:4000)

## License

MIT.
