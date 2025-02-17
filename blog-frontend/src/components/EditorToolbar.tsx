import {
  Bold,
  Italic,
  Strikethrough,
  Quote,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  Palette,
  Type,
} from "lucide-react";
import { Underline as UnderlineIcon } from "lucide-react";
import { Editor } from "@tiptap/react";
import "./TiptapEditor.css";

interface EditorToolbarProps {
  editor: Editor | null;
  handleImageUpload: () => void;
  handleColorChange: (color: string) => void;
  handleFontSizeChange: (size: string) => void;
  handleHighlightColorChange: (color: string) => void;
  handleSubmit: () => void;
  selectedColor: string;
  selectedFontSize: string;
  selectedHighlightColor: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  handleImageUpload,
  handleColorChange,
  handleFontSizeChange,
  handleHighlightColorChange,
  handleSubmit,
  selectedColor,
  selectedFontSize,
  selectedHighlightColor,
}) => {
  if (!editor) return null;

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "active" : ""}
      >
        <Bold size={18} /> Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "active" : ""}
      >
        <Italic size={18} /> Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "active" : ""}
      >
        <UnderlineIcon size={18} /> Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "active" : ""}
      >
        <Strikethrough size={18} /> Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "active" : ""}
      >
        <Quote size={18} /> Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive("highlight") ? "active" : ""}
      >
        <Highlighter size={18} /> Highlight
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft size={18} /> Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={18} /> Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={18} /> Right
      </button>
      <button onClick={handleImageUpload}>
        <ImageIcon size={18} /> Image
      </button>
      <button
        onClick={() => {
          const url = prompt("Enter link URL");
          if (url)
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
        }}
      >
        <LinkIcon size={18} /> Link
      </button>
      <div className="color-picker">
        <Palette size={18} />
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
      </div>
      <div className="font-size-picker">
        <Type size={18} />
        <select
          value={selectedFontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
        </select>
      </div>
      <div className="highlight-color-picker">
        <Highlighter size={18} />
        <input
          type="color"
          value={selectedHighlightColor}
          onChange={(e) => handleHighlightColorChange(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit} className="save-button">
        <Save size={18} /> Save Content
      </button>
    </div>
  );
};

export default EditorToolbar;
