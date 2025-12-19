import { NextResponse } from "next/server";
import fs from "fs/promises";
// LangChain imports commented out - replaced with pdf-parse
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pdf from "pdf-parse";

//const pdfUrl = "https://polite-snail-646.convex.cloud/api/storage/8ce0caf4-fc31-4f4f-a575-b248d14845bd"

export async function GET(req) {

    const requestUrl = req.url;
    const {searchParams} = new URL(requestUrl);
    const pdfUrl= searchParams.get('pdfUrl');
    console.log(pdfUrl);
    

    //1. Load the pdf File using pdf-parse
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    const pdfTextContent = data.text;


    // 2. Split the text into smaller chunks using simple chunking algorithm
    const chunkSize = 1000;
    const chunkOverlap = 200;
    const splitterList = [];

    for (let i = 0; i < pdfTextContent.length; i += chunkSize - chunkOverlap) {
      const chunk = pdfTextContent.substring(i, i + chunkSize);
      if (chunk.trim()) {
        splitterList.push(chunk);
      }
    }
      

    return NextResponse.json({result:splitterList})
}