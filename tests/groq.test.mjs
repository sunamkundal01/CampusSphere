import { test, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';

const { rankPdfChunks } = load('lib/pdfRetrieval.js');
const { POST } = load('app/api/groq/route.js');
const { formatAiAnswer } = load('lib/formatAiAnswer.js');
const originalFetch = globalThis.fetch;
const originalKey = process.env.GROQ_API_KEY;
const originalModel = process.env.GROQ_MODEL;
beforeEach(() => {
  process.env.GROQ_API_KEY = 'test-key';
  process.env.GROQ_MODEL = 'test-model';
  globalThis.fetch = async () => { throw new Error('Unexpected network request in test'); };
});
after(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = originalKey;
  if (originalModel === undefined) delete process.env.GROQ_MODEL; else process.env.GROQ_MODEL = originalModel;
});
const request = (body) => new Request('http://localhost/api/groq', { method: 'POST', body: JSON.stringify(body) });

test('retrieval ranks relevant chunks and preserves metadata', () => {
  const chunks = [
    { text: 'Photosynthesis turns sunlight into energy.', metadata: { fileId: 'one' } },
    { text: 'A database transaction follows ACID properties.', metadata: { fileId: 'one' } },
  ];
  const result = rankPdfChunks(chunks, 'Explain database transaction properties');
  assert.match(result[0].pageContent, /ACID/);
  assert.equal(result[0].metadata.fileId, 'one');
});
test('retrieval handles empty documents, unmatched queries, and context budget', () => {
  assert.deepEqual(rankPdfChunks([], 'question'), []);
  const chunks = Array.from({ length: 100 }, (_, i) => ({ text: `section ${i} `.repeat(100), metadata: {} }));
  const result = rankPdfChunks(chunks, 'summarize', 500);
  assert.ok(result.length > 0 && result.length <= 12);
  assert.ok(result.reduce((n, x) => n + x.pageContent.length, 0) <= 500);
});
test('missing API key returns actionable configuration error', async () => {
  delete process.env.GROQ_API_KEY;
  const response = await POST(request({ prompt: 'question' }));
  assert.equal(response.status, 503);
});
test('rejects malformed JSON and invalid prompts before calling Groq', async () => {
  process.env.GROQ_API_KEY = 'test-key';
  globalThis.fetch = () => { throw new Error('Must not call provider'); };
  for (const prompt of [undefined, 123, ' ', 'x'.repeat(60001)]) {
    assert.equal((await POST(request({ prompt }))).status, 400);
  }
  assert.equal((await POST(new Request('http://localhost/api/groq', { method: 'POST', body: '{' }))).status, 400);
});
test('sends server key, configured model, and grounding instructions to Groq', async () => {
  process.env.GROQ_API_KEY = 'test-key';
  process.env.GROQ_MODEL = 'configured-model';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    const body = JSON.parse(options.body);
    assert.equal(body.model, 'configured-model');
    assert.equal(body.messages[0].role, 'system');
    assert.match(body.messages[0].content, /PDF excerpts/);
    assert.equal(body.messages[1].content, 'Explain ACID');
    return Response.json({ choices: [{ message: { content: '<p>Answer</p>' } }] });
  };
  const response = await POST(request({ prompt: 'Explain ACID' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, response: '<p>Answer</p>' });
});
test('provider errors never disclose raw provider payloads', async () => {
  for (const status of [401, 403, 429, 500]) {
    globalThis.fetch = async () => new Response('private provider payload', { status });
    const response = await POST(request({ prompt: 'question' }));
    assert.equal(response.status, status === 429 ? 429 : 502);
    assert.doesNotMatch(await response.text(), /private provider payload|test-key/);
  }
});
test('handles empty provider output and network failures', async () => {
  globalThis.fetch = async () => Response.json({ choices: [] });
  assert.equal((await POST(request({ prompt: 'question' }))).status, 502);
  globalThis.fetch = async () => { throw new Error('timeout'); };
  assert.equal((await POST(request({ prompt: 'question' }))).status, 502);
});

test('renders resume answers as headings, bold labels, and separate list items', () => {
  const html = formatAiAnswer("## Primary stack\n\nPari focuses on **Python and AI/ML**.\n\n- **Languages:** Python, SQL\n- **Backend:** FastAPI, Flask\n- **Libraries:** PyTorch, Pandas");
  assert.match(html, /<h2>Primary stack<\/h2>/);
  assert.match(html, /<strong>Python and AI\/ML<\/strong>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
  assert.doesNotMatch(html, /\*\*|## /);
});

test('handles wrapped Markdown and legacy HTML without losing formatting', () => {
  assert.match(formatAiAnswer('```markdown\n**Python**\n```'), /<strong>Python<\/strong>/);
  assert.equal(formatAiAnswer('```html\n<p><strong>Python</strong></p>\n```'), '<p><strong>Python</strong></p>');
});

test('preserves programming code and strips unsafe HTML and attributes', () => {
  const html = formatAiAnswer('```python\nprint("hello")\n```\n\n<p onclick="alert(1)">Safe</p><script>alert(1)</script><img src=x onerror="alert(1)">');
  assert.match(html, /<pre><code>print\("hello"\)/);
  assert.match(html, /<p>Safe<\/p>/);
  assert.doesNotMatch(html, /onclick|script|onerror|<img|alert\(1\)/);
});

test('API converts provider Markdown before returning it to the canvas', async () => {
  globalThis.fetch = async () => Response.json({ choices: [{ message: { content: '## Stack\n\n- **Languages:** Python, SQL\n- **Backend:** FastAPI' } }] });
  const response = await POST(request({ prompt: 'What is Pari primary stack?' }));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.match(data.response, /<h2>Stack<\/h2>/);
  assert.match(data.response, /<li><strong>Languages:<\/strong>/);
  assert.doesNotMatch(data.response, /\*\*|## /);
});

test('uses the configured default model when GROQ_MODEL is absent', async () => {
  delete process.env.GROQ_MODEL;
  const { DEFAULT_GROQ_MODEL } = load('configs/AIModel.js');
  globalThis.fetch = async (_, options) => {
    assert.equal(JSON.parse(options.body).model, DEFAULT_GROQ_MODEL);
    return Response.json({ choices: [{ message: { content: 'A short answer.' } }] });
  };
  assert.equal((await POST(request({ prompt: 'Question' }))).status, 200);
});

test('accepts the maximum prompt length and rejects invalid request-body shapes', async () => {
  globalThis.fetch = async () => Response.json({ choices: [{ message: { content: 'OK' } }] });
  assert.equal((await POST(request({ prompt: 'x'.repeat(60000) }))).status, 200);
  for (const body of [null, [], 'question', { prompt: false }, { prompt: {} }]) {
    assert.equal((await POST(request(body))).status, 400);
  }
});

test('invalid provider JSON and content with no usable text fail cleanly', async () => {
  globalThis.fetch = async () => new Response('{broken', { status: 200 });
  assert.equal((await POST(request({ prompt: 'Question' }))).status, 502);
  for (const content of [null, 42, '  ', '<script>unsafe()</script>']) {
    globalThis.fetch = async () => Response.json({ choices: [{ message: { content } }] });
    const response = await POST(request({ prompt: 'Question' }));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).success, false);
  }
});

test('renders nested and numbered lists and preserves inline programming notation', () => {
  const html = formatAiAnswer('### Steps\n\n1. Install `fastapi`.\n2. Run the API.\n\n- AI tools\n  - **PyTorch**\n  - TensorFlow\n\nUse `a < b && b > 0` in code.');
  assert.match(html, /<ol>/);
  assert.equal((html.match(/<ul>/g) || []).length, 2);
  assert.match(html, /<code>fastapi<\/code>/);
  assert.match(html, /a &lt; b &amp;&amp; b &gt; 0/);
});

test('sanitizer removes links and embeds while retaining readable answer text', () => {
  const html = formatAiAnswer('Read [Python docs](https://python.org).\n\n<iframe src="https://example.com"></iframe><p style="color:red" data-secret="value">Python</p>');
  assert.match(html, /Python docs/);
  assert.match(html, /<p>Python<\/p>/);
  assert.doesNotMatch(html, /<a\b|<iframe|style=|data-secret|https:\/\//);
});
