'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { BoldIcon, Code2, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Loader2, Quote, Redo2Icon, SparklesIcon, Strikethrough, UnderlineIcon, Undo2Icon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { toast } from 'sonner';
import { useUser } from '../../../lib/GoogleAuthContext';


const EditExtenstion = ({ editor }) => {
    const {fileId} = useParams()
    const searchAi = useAction(api.myActions.search)
    const saveNotes = useMutation(api.notes.AddNotes)
    const {user} = useUser()
    const [aiLoading, setAiLoading] = useState(false)

    if (!editor) return null;

    const onAiClick=async()=>{
      
      if (aiLoading) return;
      try {
        const selectedText = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        )
        if (!selectedText.trim()) {
          toast.error("Select a question in your notes first.", {
            description: "Highlight the text you want answered, then press Ask AI.",
          });
          return;
        }

        setAiLoading(true);
        const result = await searchAi({
          query:selectedText,
          fileId:fileId
        })

        const UnformatedAnwer = JSON.parse(result);
        let AllUnformatedAnwer = '';
        UnformatedAnwer&&UnformatedAnwer.forEach(item=>{
          AllUnformatedAnwer = AllUnformatedAnwer+'\n\n'+item.pageContent
        })
        
        if (!AllUnformatedAnwer.trim()) {
          throw new Error("No PDF text found. Please upload a PDF containing selectable text.");
        }
        const PROMPT = "Question:\n" + selectedText + "\n\nPDF excerpts:\n" + AllUnformatedAnwer;
           

        // Call the server-side API route instead of direct client-side call
        const apiResponse = await fetch('/api/groq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: PROMPT,
            history: []
          })
        });

        const apiData = await apiResponse.json();
        
        if (!apiData.success) {
          throw new Error(apiData.error || 'Failed to get AI response');
        }

        // The server returns sanitized editor HTML, regardless of model format.
        // Append using an editor transaction so existing content and undo survive.
        editor.chain().focus().insertContentAt(editor.state.doc.content.size,
          '<hr>' + apiData.response + '<p></p>'
        ).run();
        
        await saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy:user?.primaryEmailAddress.emailAddress
        })
        
        toast.success("Answer added to your notes")
      } catch (error) {
        console.error("AI answer failed");
        toast.error(error.message || "Failed to get AI response. Please try again.");
      } finally {
        setAiLoading(false);
      }
      
    }
    
    const hasSelection = !editor.state.selection.empty;

    return (
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card/95 px-3 py-2 backdrop-blur">
        <div role="toolbar" aria-label="Formatting" className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ToolButton label="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 />
          </ToolButton>
          <ToolButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 />
          </ToolButton>
          <ToolButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 />
          </ToolButton>
          <Divider />
          <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <BoldIcon />
          </ToolButton>
          <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic />
          </ToolButton>
          <ToolButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon />
          </ToolButton>
          <ToolButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough />
          </ToolButton>
          <Divider />
          <ToolButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List />
          </ToolButton>
          <ToolButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered />
          </ToolButton>
          <ToolButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote />
          </ToolButton>
          <ToolButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code2 />
          </ToolButton>
          <Divider />
          <ToolButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo2Icon />
          </ToolButton>
          <ToolButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo2Icon />
          </ToolButton>
        </div>

        <button
          type="button"
          onClick={() => onAiClick()}
          disabled={aiLoading}
          aria-busy={aiLoading}
          title={hasSelection ? 'Answer the selected question using this PDF' : 'Select a question in your notes first'}
          className={cn(
            'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-[background-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai focus-visible:ring-offset-2 disabled:cursor-wait',
            hasSelection || aiLoading
              ? 'bg-ai text-ai-foreground shadow-sm shadow-ai/30 hover:bg-ai/90'
              : 'bg-ai/10 text-ai hover:bg-ai/15'
          )}
        >
          {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <SparklesIcon className="h-4 w-4" aria-hidden="true" />}
          <span>{aiLoading ? 'Thinking…' : 'Ask AI'}</span>
        </button>
      </div>
    );
  };

function ToolButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors [&_svg]:h-[18px] [&_svg]:w-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35',
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-border" />;
}

export default EditExtenstion
