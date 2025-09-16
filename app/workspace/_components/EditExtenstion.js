"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { chatSession } from "../../../configs/AIModel";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  HighlighterIcon,
  Italic,
  Redo2Icon,
  SparklesIcon,
  Strikethrough,
  UnderlineIcon,
  Undo2Icon,
  WandSparklesIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const EditExtenstion = ({ editor }) => {
  // Only render the button if the editor is initialized
  if (!editor) return null; // Early return if editor is null

  const { fileId } = useParams();
  const searchAi = useAction(api.myActions.search);
  const queryWithLangChainGemini = useAction(
    api.myActions.queryWithLangChainAndGemini
  );
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user } = useUser();

  const onAiClick = async () => {
    toast("AI is getting your answer 🪄");

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );
    console.log("Selected question:", selectedText);
    console.log("File ID:", fileId);

    try {
      // Use the new hybrid LangChain + Gemini approach
      const result = await queryWithLangChainGemini({
        question: selectedText,
        fileId: fileId,
        limit: 5,
        includeContext: false,
      });

      if (result.success) {
        console.log("AI Answer received:", result.answer);

        // Insert the formatted answer directly (it's already in HTML format from Gemini)
        const AllText = editor.getHTML();
        const answerHtml = `<div class="ai-answer-section" style="margin: 16px 0; padding: 12px; border-left: 4px solid #3b82f6; background-color: #f8fafc;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af; font-weight: 600;">🤖 AI Answer:</h4>
            <div>${result.answer}</div>
          </div>`;

        editor.commands.setContent(AllText + answerHtml);

        // Save the updated notes
        saveNotes({
          notes: editor.getHTML(),
          fileId: fileId,
          createdBy: user?.primaryEmailAddress.emailAddress,
        });

        toast.success("AI answer added successfully! ✨");
      } else {
        console.log("AI search failed:", result.message);
        toast.error(result.message || "Failed to get AI answer");

        // Fallback to old method if new method fails
        await fallbackToOldMethod(selectedText);
      }
    } catch (error) {
      console.error("Error with hybrid approach:", error);
      toast.error("AI encountered an error. Trying alternative method...");

      // Fallback to old method
      await fallbackToOldMethod(selectedText);
    }
  };

  // Fallback method using the original approach
  const fallbackToOldMethod = async (selectedText) => {
    try {
      const result = await searchAi({
        query: selectedText,
        fileId: fileId,
      });

      const UnformatedAnswer = JSON.parse(result);
      let AllUnformatedAnswer = "";
      UnformatedAnswer &&
        UnformatedAnswer.forEach((item) => {
          AllUnformatedAnswer = AllUnformatedAnswer + item.pageContent;
        });

      const PROMPT =
        "Extract a comprehensive, detailed answer to this question: " +
        selectedText +
        "\n\nDocument text: " +
        AllUnformatedAnswer +
        "\n\nCRITICAL RULES: NEVER mention 'chunk', 'context', 'provided text', or 'based on'. Extract ALL relevant information including complete numbered lists, bullet points, and sequential information. When extracting lists, include ALL items in complete sequence. Present as comprehensive response directly from source. Use exact wording from document. Pay special attention to numbered lists, requests, requirements. Preserve original structure of lists and numbered items. Format with HTML using headings, lists, and emphasis for better readability.";

      const AIModelResult = await chatSession.sendMessage(PROMPT);
      console.log("Fallback AI Result:", AIModelResult.response.text());
      const finalAns = AIModelResult.response
        .text()
        .replace("```", "")
        .replace("html", "")
        .replace("```", "");

      const AllText = editor.getHTML();
      const answerHtml = `<div class="ai-answer-section" style="margin: 16px 0; padding: 12px; border-left: 4px solid #3b82f6; background-color: #f8fafc;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af; font-weight: 600;">🤖 AI Answer:</h4>
            <div>${finalAns}</div>
          </div>`;
      editor.commands.setContent(AllText + answerHtml);

      saveNotes({
        notes: editor.getHTML(),
        fileId: fileId,
        createdBy: user?.primaryEmailAddress.emailAddress,
      });

      toast.success("Answer provided using fallback method");
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      toast.error("Failed to get AI answer. Please try again.");
    }
  };

  return (
    editor && (
      <div className="p-5">
        <div className="control-group">
          <div className="button-group flex md:gap-3 gap-x-1">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 })
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 })
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 })
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              H3
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={
                editor.isActive("bold")
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <BoldIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={
                editor.isActive("italic")
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <Italic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={
                editor.isActive("underline")
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <UnderlineIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={
                editor.isActive("strike")
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <Strikethrough />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={
                editor.isActive("highlight")
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <HighlighterIcon />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" })
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <AlignLeft />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" })
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <AlignCenter />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" })
                  ? "bg-slate-200 rounded-md p-1 transition-all"
                  : ""
              }
            >
              <AlignRight />
            </button>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo2Icon />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo2Icon />
            </button>
            <button
              onClick={() => onAiClick()}
              className={"hover:bg-slate-200 rounded-md p-1 transition-all"}
            >
              <SparklesIcon />
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default EditExtenstion;
