const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyDbsfhfA3eXs0_d3Y6j7oeOR6wgZG3pPsc"; // Hardcoded API key

if (!apiKey) {
  console.error(
    "❌ GEMINI API KEY NOT FOUND! Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables."
  );
} else if (process.env.NODE_ENV !== "production") {
  console.log("✅ Gemini API Key loaded");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using gemini-2.5-flash
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});
