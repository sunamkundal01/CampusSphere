const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  // Server-side only: This file is now primarily for server-side API route usage
  // Client-side code should use the /api/gemini endpoint instead
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI API KEY NOT FOUND! Please set GEMINI_API_KEY in your environment variables.");
  } else if (process.env.NODE_ENV !== 'production') {
    console.log("✅ Gemini API Key loaded");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // ✅ gemini-2.5-flash is valid and supported! 
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType:  "text/plain",
  };

  export const chatSession = model. startChat({
    generationConfig,
    history: [],
  });
