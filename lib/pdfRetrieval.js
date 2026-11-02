const STOP_WORDS = new Set("a an and are as at be by for from how i in is it of on or that the this to was what when where which who why with you your".split(" "));

function tokenize(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    .filter((word) => !STOP_WORDS.has(word));
}

// BM25 ranks chunks within one PDF without an external embedding service.
export function rankPdfChunks(chunks, question, maxCharacters = 24000) {
  if (!chunks.length) return [];
  const terms = [...new Set(tokenize(question))];
  const documents = chunks.map((chunk, index) => {
    const tokens = tokenize(chunk.text);
    const counts = new Map();
    for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
    return { chunk, index, length: tokens.length, counts };
  });
  const averageLength = documents.reduce((sum, doc) => sum + doc.length, 0) / documents.length || 1;
  const frequencies = new Map(terms.map((term) => [term,
    documents.filter((doc) => doc.counts.has(term)).length]));
  const ranked = documents.map((doc) => ({
    ...doc,
    score: terms.reduce((score, term) => {
      const count = doc.counts.get(term) || 0;
      const frequency = frequencies.get(term);
      const idf = Math.log(1 + (documents.length - frequency + 0.5) / (frequency + 0.5));
      return score + idf * (count * 2.2) / (count + 1.2 * (0.25 + 0.75 * doc.length / averageLength));
    }, 0),
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  // For questions without matching words, sample across the PDF.
  const candidates = ranked[0].score > 0 ? ranked : documents.filter((_, index) =>
    index % Math.max(1, Math.ceil(documents.length / 12)) === 0);
  let remaining = maxCharacters;
  return candidates.slice(0, 12).map(({ chunk }) => {
    const pageContent = chunk.text.slice(0, remaining);
    remaining -= pageContent.length;
    return { pageContent, metadata: chunk.metadata };
  }).filter((chunk) => chunk.pageContent);
}
