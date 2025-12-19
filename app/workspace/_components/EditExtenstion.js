'use client'
import React from 'react'
import { useParams } from 'next/navigation';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {chatSession} from '../../../configs/AIModel'
import { AlignCenter, AlignLeft, AlignRight, BoldIcon, HighlighterIcon, Italic, Redo2Icon, SparklesIcon, Strikethrough, UnderlineIcon, Undo2Icon, WandSparklesIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';


const EditExtenstion = ({ editor }) => {
    // Only render the button if the editor is initialized
    if (!editor) return null; // Early return if editor is null

    const {fileId} = useParams()
    const searchAi = useAction(api.myActions.search)
    const saveNotes = useMutation(api.notes.AddNotes)
    const {user} = useUser()

    const onAiClick=async()=>{
      toast("AI is getting your answer 🪄")
      
      try {
        const selectedText = editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        )
        console.log(selectedText);  
        console.log(fileId);
            
        const result = await searchAi({
          query:selectedText,
          fileId:fileId
        })

        const parsedResult = JSON.parse(result);
        // New format: { answer: string, context: [{text: string}] }
        // Use the answer directly from Gemini
        const answer = parsedResult.answer || '';
        
        // Format the answer in HTML if it's not already
        let finalAns = answer;
        if (!answer.includes('<')) {
          // Convert plain text to HTML paragraphs
          finalAns = answer.split('\n').map(para => para.trim() ? `<p>${para}</p>` : '').join('');
        } else {
          // Clean up any markdown-style code blocks
          finalAns = answer.replace(/```html/g, '').replace(/```/g, '');
        }
        
        const AllText= editor.getHTML();
        editor.commands.setContent(AllText+'<p> <strong> Answer: </strong></p>'+finalAns)
        
        saveNotes({
          notes:editor.getHTML(),
          fileId:fileId,
          createdBy:user?.primaryEmailAddress.emailAddress
        })
      } catch (error) {
        console.error("Gemini API Error:", error);
        toast.error("Failed to get AI response. Please try again or check your API key configuration.");
      }
      
    }
    
    return editor&&(
      <div className='p-5'>
        <div className="control-group">
          <div className="button-group flex md:gap-3 gap-x-1">
            <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            H3
          </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
            >
              <BoldIcon/>
            </button>
            <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <Italic/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <UnderlineIcon/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <Strikethrough/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <HighlighterIcon/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <AlignLeft/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <AlignCenter/>
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 rounded-md p-1 transition-all' : ''}
          >
            <AlignRight/>
          </button>
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo2Icon/>
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo2Icon/>
          </button>
          <button
            onClick={() => onAiClick()}
            className={'hover:bg-slate-200 rounded-md p-1 transition-all'}
          >
            <SparklesIcon/>
          </button>
          </div>
        </div>
      </div>
    );
  };
export default EditExtenstion