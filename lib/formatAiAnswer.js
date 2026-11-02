import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const markdown = new MarkdownIt({ html: true, breaks: true, linkify: false });
// Tiptap StarterKit does not support tables. Ask the model for lists instead.
markdown.disable("table");

export function formatAiAnswer(answer) {
  let content = answer.trim();
  // Some models wrap the entire answer even when asked not to. Preserve actual
  // programming code fences, but unwrap presentation-only HTML/Markdown fences.
  const wrapped = content.match(/^```(?:html|markdown|md)\s*\n([\s\S]*?)\n```$/i);
  if (wrapped) content = wrapped[1];

  return sanitizeHtml(markdown.render(content), {
    allowedTags: ["p", "strong", "em", "s", "h2", "h3", "ul", "ol", "li", "blockquote", "pre", "code", "br", "hr"],
    allowedAttributes: {},
    transformTags: { h1: "h2", h4: "h3", h5: "h3", h6: "h3" },
  }).trim();
}
