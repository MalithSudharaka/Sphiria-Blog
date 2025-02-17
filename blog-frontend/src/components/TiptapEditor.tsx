import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./TiptapEditor.css";
import { Color } from "@tiptap/extension-color";
import { FontSize } from "@tiptap/extension-font-size";
import axios from "axios";
import ResizableImage from "../ResizeableImage";
import { Image as TipTapImage } from "@tiptap/extension-image";
import EditorToolbar from "./EditorToolbar"; // ✅ Importing the new toolbar component
import TagInput from "./TagInput";
import CategoryInput from "./CategoryInput";

const TiptapEditor = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default text color is black
  const [selectedFontSize, setSelectedFontSize] = useState("16px"); // Default font size
  const [selectedHighlightColor, setSelectedHighlightColor] =
    useState("#FFFF00"); // Default highlight color is yellow

  const [tags, setTags] = useState<string[]>([]); // State to hold tags
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  


  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Link.configure({ openOnClick: true }),
      ResizableImage.configure({ allowBase64: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TipTapImage.configure({
        allowBase64: true,
        draggable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
      FontSize,
    ],
    content: "<p>Start typing...</p>",
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const image = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      };

      if (image) {
        reader.readAsDataURL(image);
      }
    },
    [editor]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
    noClick: true,
    noKeyboard: true,
  });

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
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

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const handleHighlightColorChange = (color: string) => {
    setSelectedHighlightColor(color);
    editor.chain().focus().toggleHighlight({ color }).run();
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async () => {
    if (!editor) return;

    const content = editor.getHTML();
    const payload = { content, tags: selectedTags }; // ✅ Include selectedTags

    try {
      await axios.post("http://localhost:5000/contents", payload, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Content saved successfully!");
    } catch (error) {
      console.error("Error submitting content:", error);
      alert(error.response?.data?.error || "An error occurred while saving content.");
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
       {/* Tag Input Component */}
       <TagInput onTagsChange={setSelectedTags} />

       {/* Category Input */}
      <CategoryInput onCategoryChange={handleCategoryChange} />

      {/* ✅ Use the new EditorToolbar component */}
      <EditorToolbar
        editor={editor}
        handleSubmit={handleSubmit}
        handleImageUpload={handleImageUpload}
        selectedColor={selectedColor}
        handleColorChange={handleColorChange}
        selectedFontSize={selectedFontSize}
        handleFontSizeChange={handleFontSizeChange}
        selectedHighlightColor={selectedHighlightColor}
        handleHighlightColorChange={handleHighlightColorChange}
      />

      {/* Editor Content */}
      <div {...getRootProps()} className="editor-dropzone">
        <input {...getInputProps()} />
        <EditorContent editor={editor} className="editor" />
      </div>
    </div>
  );
};

export default TiptapEditor;
