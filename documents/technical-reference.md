# Technical reference

## Stack and code map

- **Next.js:** 15.3.8; App Router; React 18; predominantly JavaScript/JSX.
- **TypeScript:** middleware, generated types, and Convex configuration; frontend alias `@/*` points to the repository root.
- **UI:** Tailwind CSS 3, Radix/shadcn controls, Lucide, Sonner; Inter and Outfit through `next/font/google`.
- **Backend:** Convex queries, mutations, actions, reactive subscriptions, and file storage.
- **Authentication:** Firebase 12 Google sign-in, wrapped by a React context.
- **Editor:** Tiptap 2, StarterKit, Underline, and Placeholder.
- **PDF processing:** LangChain community loader and recursive text splitter.
- **Generation:** Groq via native server-side `fetch`; no Groq SDK is required.
- **Answer conversion:** `markdown-it` and `sanitize-html`.
- **Export:** browser print for PDF; dynamic `html-docx-js` import for DOCX. Its fallback writes HTML with a `.docx` extension rather than a real DOCX archive.

## Convex function map

- **`user.js`** — `createuser`: create a profile if no matching email exists.
- **`userProfiles.js`** — `updateUserProfile`, `getUserProfile`, `getAllUsers`, `searchUsersByExpertise`, `getUsersByDepartment`, `getUsersByBatch`, `getRecommendedUsers`.
- **`fileStorage.js`** — `generateUploadUrl`, `getFileUrl`, `AddFileEntryToDb`, `getFileRecord`, `GetUserFiles`.
- **`pyqStorage.js`** — `AddPyqFileEntryToDb`, `GetAllPyqFiles`, `GetPyqFilesByFilter`, `GetUniqueSemesters`, `GetUniqueSubjects`.
- **`notes.js`** — `AddNotes`: upsert HTML by file ID; `GetNotes`: retrieve content.
- **`myActions.js`** — public actions `ingest`, `search`; internal mutation `storeChunks`; internal query `getChunks`.
- **`convex/_generated/`** — generated API/server/types; regenerate through the Convex CLI.
- **`convex/langchain/db.ts`** — retained LangChain Convex utilities; current ingestion/search bypass vector-store calls.

## Environment variables

- **Firebase browser config:** `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- **Convex browser URL:** `NEXT_PUBLIC_CONVEX_URL`.
- **Convex CLI target:** `CONVEX_DEPLOYMENT`; deployment sync requires authenticated CLI credentials.
- **Groq server secret:** `GROQ_API_KEY`.
- **Optional model override:** `GROQ_MODEL`.
- **Storage:** PDFs currently use Convex storage; Firebase storage settings are part of Firebase initialization.
- **Local file:** `.env.local`, excluded by `.gitignore`; documentation intentionally contains no credential values.

## Local operation

```bash
npm install
npx convex dev      # Terminal 1: authenticate and sync schema/functions
npm run dev        # Terminal 2: Next.js at localhost:3000
```

- **Production build:** `npm run build`; start with `npm start`.
- **Deployment split:** the Next.js app and Convex backend are deployed separately; frontend environment variables must target the intended Convex deployment.
- **Hosting:** README links to a Vercel deployment; hosting environment configuration is external to this repository.
- **Fonts:** production builds can require network access to download Google fonts.
- **Lint script:** currently `next lint`; no ESLint configuration/dependency is present in this repository.

## Tests

- `npm test` — all **42** current tests.
- `npm run test:ai` — Groq request handling and answer conversion.
- `npm run test:backend` — profiles, storage, notes, PYQs, ingestion, and retrieval.
- `npm run test:watch` — watch mode.
- **Runner:** Node built-in test runner; esbuild loads application modules.
- **Backend harness:** `convex-test` with a fresh in-memory database per test.
- **Isolation:** mocked Groq calls, no API keys, no deployed database writes.
- **Coverage boundary:** browser behavior, Firebase popup flow, real PDF extraction, and live provider responses are outside the automated suite.

## Current implementation limits

- Route protection is client-side; Next.js API routes and inspected Convex functions do not verify the Firebase session or file ownership.
- Most database lookups use collection filters; only document retrieval has a custom scalar index.
- PDF URL fetching has no host allowlist; upload size/type checks occur in the browser.
- No rate limiter, retry queue, background ingestion job, or rollback across upload stages.
- Notes load reactively; remote content updates can replace the local editor content.
- PDF/DOCX export uses saved notes, so unsaved edits must be saved first.

## Related documents

- [Architecture](architecture.md)
- [Database schema](database-schema.md)
- [RAG call flow](rag-flow.md)
