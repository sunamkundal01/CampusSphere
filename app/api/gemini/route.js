import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // Get the API key from server-side environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    // Validate API key exists
    if (!apiKey) {
      console.error("❌ GEMINI API KEY NOT FOUND! Please set GEMINI_API_KEY in your environment variables.");
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const { prompt, history } = await req.json();

    // Validate prompt is provided
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model with updated version
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    // Configure generation settings
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    // Start chat session
    const chatSession = model.startChat({
      generationConfig,
      history: history || [],
    });

    // Send message and get response
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    // Return success response
    return NextResponse.json({
      success: true,
      response: responseText,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get AI response",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
