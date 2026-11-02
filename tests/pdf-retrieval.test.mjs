import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backend, api, internal, seed } from './helpers/convex.mjs';
import { load } from './helpers/load.mjs';

const { rankPdfChunks } = load('lib/pdfRetrieval.js');
const chunk = (text, fileId = 'one') => ({ text, metadata: { fileId } });

test('PDF ingestion stores nonblank chunks and preserves their document association', async () => {
  const t = backend();
  await t.action(api.myActions.ingest, { fileId: 'one', sliptText: ['Python and SQL', ' ', 'FastAPI backend'] });
  const docs = await t.query(internal.myActions.getChunks, { fileId: 'one' });
  assert.deepEqual(docs.map(d => d.text), ['Python and SQL', 'FastAPI backend']);
  assert.ok(docs.every(d => d.metadata.fileId === 'one'));
});

test('re-ingestion replaces one PDF without deleting another PDF or creating duplicates', async () => {
  const t = backend();
  await t.action(api.myActions.ingest, { fileId: 'one', sliptText: ['Old text'] });
  await t.action(api.myActions.ingest, { fileId: 'two', sliptText: ['Other text'] });
  await t.action(api.myActions.ingest, { fileId: 'one', sliptText: ['New text'] });
  assert.deepEqual((await t.query(internal.myActions.getChunks, { fileId: 'one' })).map(d => d.text), ['New text']);
  assert.deepEqual((await t.query(internal.myActions.getChunks, { fileId: 'two' })).map(d => d.text), ['Other text']);
  assert.equal((await t.run(ctx => ctx.db.query('documents').collect())).length, 2);
});

test('search stays within the requested PDF even if another PDF is a stronger match', async () => {
  const t = backend();
  await t.action(api.myActions.ingest, { fileId: 'one', sliptText: ['Python language', 'SQL database transactions'] });
  await t.action(api.myActions.ingest, { fileId: 'two', sliptText: ['SQL SQL SQL database transactions'] });
  const result = JSON.parse(await t.action(api.myActions.search, { fileId: 'one', query: 'SQL database' }));
  assert.match(result[0].pageContent, /SQL database transactions/);
  assert.ok(result.every(d => d.metadata.fileId === 'one'));
  assert.deepEqual(JSON.parse(await t.action(api.myActions.search, { fileId: 'missing', query: 'SQL' })), []);
});

test('legacy Gemini-era chunks remain searchable by metadata.fileId', async () => {
  const t = backend();
  await seed(t, 'documents', [
    { text: 'Legacy Python skills', embedding: Array(3072).fill(0), metadata: { fileId: 'legacy' } },
    { text: 'Other document', metadata: { fileId: 'other' } },
  ]);
  const result = JSON.parse(await t.action(api.myActions.search, { fileId: 'legacy', query: 'Python' }));
  assert.equal(result.length, 1);
  assert.equal(result[0].pageContent, 'Legacy Python skills');
  assert.equal(result[0].metadata.fileId, 'legacy');
});

test('new chunks take precedence over legacy versions after re-upload', async () => {
  const t = backend();
  await seed(t, 'documents', [chunk('Outdated content')]);
  await t.action(api.myActions.ingest, { fileId: 'one', sliptText: ['Updated content'] });
  const result = await t.query(internal.myActions.getChunks, { fileId: 'one' });
  assert.deepEqual(result.map(d => d.text), ['Updated content']);
});

test('retrieval ignores case and punctuation and understands Unicode tokens', () => {
  const chunks = [chunk('SQL, PostgreSQL and Python.'), chunk('हिंदी भाषा में अध्ययन')];
  assert.equal(rankPdfChunks(chunks, 'PYTHON?')[0].pageContent, chunks[0].text);
  assert.equal(rankPdfChunks(chunks, 'हिंदी')[0].pageContent, chunks[1].text);
});

test('retrieval handles empty text, stopword-only questions, and zero context budget', () => {
  const chunks = [chunk(''), chunk('Python and SQL')];
  assert.deepEqual(rankPdfChunks(chunks, 'Python', 0), []);
  assert.equal(rankPdfChunks(chunks, 'what is the')[0].pageContent, 'Python and SQL');
  assert.deepEqual(rankPdfChunks([chunk('')], 'anything'), []);
});

test('retrieval is deterministic and does not mutate the source chunks', () => {
  const chunks = [chunk('SQL database'), chunk('Python language')];
  const original = structuredClone(chunks);
  assert.deepEqual(rankPdfChunks(chunks, 'Python'), rankPdfChunks(chunks, 'Python'));
  assert.deepEqual(chunks, original);
});

test('retrieval limits excerpts and respects the total character budget', () => {
  const chunks = Array.from({ length: 50 }, (_, i) => chunk(`Python topic ${i} `.repeat(100)));
  const result = rankPdfChunks(chunks, 'Python', 2500);
  assert.ok(result.length <= 12);
  assert.ok(result.every(d => d.pageContent.length > 0));
  assert.ok(result.reduce((n, d) => n + d.pageContent.length, 0) <= 2500);
});
