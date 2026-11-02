import { NextResponse } from "next/server";
import { DEFAULT_GROQ_MODEL, STUDY_ASSISTANT_PROMPT } from "../../../configs/AIModel";
import { formatAiAnswer } from "../../../lib/formatAiAnswer";

export async function POST(req) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Set GROQ_API_KEY in .env.local to enable AI answers." },
      { status: 503 }
    );
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }
  const { prompt } = body || {};
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 60000) {
    return NextResponse.json(
      { success: false, error: "Provide a non-empty prompt of at most 60,000 characters." },
      { status: 400 }
    );
  }
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
        messages: [
          { role: "system", content: STUDY_ASSISTANT_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_completion_tokens: 4096,
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) {
      // Do not expose provider payloads or credentials to the browser.
      const error = response.status === 429
        ? "Groq rate limit reached. Please try again shortly."
        : response.status === 401 || response.status === 403
          ? "Groq rejected the API key or model access. Check your server configuration."
          : "Groq could not generate an answer. Please try again.";
      return NextResponse.json({ success: false, error }, { status: response.status === 429 ? 429 : 502 });
    }
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json({ success: false, error: "Groq returned an empty answer." }, { status: 502 });
    }
    const formattedAnswer = formatAiAnswer(answer);
    if (!formattedAnswer) {
      return NextResponse.json({ success: false, error: "Groq returned an empty answer." }, { status: 502 });
    }
    return NextResponse.json({ success: true, response: formattedAnswer });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to reach Groq. Please try again." }, { status: 502 });
  }
}
