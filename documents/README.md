# CampusSphere technical documentation

- **Purpose:** student discovery, shared previous-year question papers (PYQs), and a personal PDF/notes workspace.
- **Scope:** the current source code; diagrams describe implemented behavior.
- **Format:** short bullets and Mermaid diagrams. Use a Markdown viewer with Mermaid support to display diagrams.

## Read in this order

1. [Architecture](architecture.md) — services, routes, authentication, and feature boundaries.
2. [Database schema](database-schema.md) — all fields, indexes, and logical relationships.
3. [RAG flow](rag-flow.md) — PDF ingestion, retrieval, Groq calls, and answer rendering.
4. [Technical reference](technical-reference.md) — function map, configuration, commands, tests, and implementation limits.

## Quick facts

- **UI/server:** Next.js 15 App Router + React 18.
- **Database/files:** Convex; reactive reads through `useQuery`.
- **Sign-in:** Firebase Google OAuth; client-side route guards.
- **Generation:** Groq; default `qwen/qwen3.8-27b`.
- **Retrieval:** per-PDF BM25 keyword ranking; new uploads do not generate embeddings.
- **Notes:** Tiptap HTML stored in Convex; Markdown AI output is converted and sanitized before insertion.
