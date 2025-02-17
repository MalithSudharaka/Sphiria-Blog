import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Bold, Italic, Strikethrough, Quote, Highlighter, 
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Link as LinkIcon, Save 
} from 'lucide-react';
import { Underline as UnderlineIcon } from 'lucide-react';
import { Color } from '@tiptap/extension-color';
import axios from 'axios';
import './TiptapEditor.css'; 

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Link.configure({ openOnClick: true }),
      Image.configure({ allowBase64: true, inline: true }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
    ],
    content: '<p>Start typing...</p>',
  });

  // Function to handle image upload from drag-and-drop
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const image = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    };

    if (image) {
      reader.readAsDataURL(image);
    }
  }, [editor]);

  // Set up react-dropzone for drag-and-drop image upload
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
    noClick: true,
    noKeyboard: true,
  });

  // Function to handle image upload via button
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          editor.chain().focus().setImage({ src: imageUrl }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Function to submit content to backend
  const handleSubmit = async () => {
    if (!editor) return;
  
    const content = editor.getHTML(); // Get editor content as HTML
    const payload = { content };
  
    try {
      const response = await axios.post('http://localhost:5000/save-content', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error submitting content:', error);
      alert(error.response?.data?.error || 'An error occurred while saving content.');
    }
  };

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="toolbar">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={editor.isActive('bold') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('bold') ? '#4CAF50' : '' }}
        >
          <Bold size={18} /> Bold
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={editor.isActive('italic') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('italic') ? '#4CAF50' : '' }}
        >
          <Italic size={18} /> Italic
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          className={editor.isActive('underline') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('underline') ? '#4CAF50' : '' }}
        >
          <UnderlineIcon size={18} /> Underline
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleStrike().run()} 
          className={editor.isActive('strike') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('strike') ? '#4CAF50' : '' }}
        >
          <Strikethrough size={18} /> Strike
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          className={editor.isActive('blockquote') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('blockquote') ? '#4CAF50' : '' }}
        >
          <Quote size={18} /> Blockquote
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          className={editor.isActive('highlight') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('highlight') ? '#4CAF50' : '' }}
        >
          <Highlighter size={18} /> Highlight
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive('alignLeft') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('alignLeft') ? '#4CAF50' : '' }}
        >
          <AlignLeft size={18} /> Left
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
          className={editor.isActive('alignCenter') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('alignCenter') ? '#4CAF50' : '' }}
        >
          <AlignCenter size={18} /> Center
        </button>
        <button 
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
          className={editor.isActive('alignRight') ? 'active' : ''}
          style={{ backgroundColor: editor.isActive('alignRight') ? '#4CAF50' : '' }}
        >
          <AlignRight size={18} /> Right
        </button>
        <button onClick={handleImageUpload}>
          <ImageIcon size={18} /> Image
        </button>
        <button 
          onClick={() => {
            const url = prompt('Enter link URL');
            if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={18} /> Link
        </button>
        <button onClick={handleSubmit} className="save-button">
          <Save size={18} /> Save Content
        </button>
      </div>

      {/* Editor Content */}
      <div {...getRootProps()} className="editor-dropzone">
        <input {...getInputProps()} />
        <EditorContent editor={editor} className="editor" />
      </div>
    </div>
  );
};

export default TiptapEditor;