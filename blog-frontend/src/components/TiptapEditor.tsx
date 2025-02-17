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
  const [title, setTitle] = useState(""); // State for title
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default text color
  const [selectedFontSize, setSelectedFontSize] = useState("16px"); // Default font size
  const [selectedHighlightColor, setSelectedHighlightColor] = useState("#FFFF00"); // Default highlight color

  const [tags, setTags] = useState<string[]>([]); // State to hold tags
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [contentType, setContentType] = useState(""); // State for content type
  const [eventLocation, setEventLocation] = useState(""); // State for event location
  const [eventTime, setEventTime] = useState(""); // State for event time
  const [baseCode, setBaseCode] = useState<string>("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Link.configure({ openOnClick: true }),
      ResizableImage.configure({
        allowBase64: true,
        onImageResize: (base64) => {
          console.log("Base64 from ResizableImage:", base64);
          setBaseCode(base64)
          // You can now use the base64 data in your TiptapEditor component
        },
      }),
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

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories); // Set the selected categories from child
  };

  const handleContentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setContentType(event.target.value);
  };

  const handleSubmit = async () => {
    if (!editor) return;
  
    // Get the content from the editor (which includes base64 images)
    let content = editor.getHTML();
  
    // If baseCode is available, replace the image source in the content with the base64 data
    if (baseCode) {
      // Extract the base64 data and metadata
      const [base64Data, widthMetadata, heightMetadata] = baseCode.split("|");
      const width = widthMetadata.split(":")[1];
      const height = heightMetadata.split(":")[1];
  
      // Create a new image element with the base64 data and dimensions
      const newImage = `<img src="${baseCode}"`;
  
      // Replace the existing image in the content with the new image
      content = content.replace(/<img[^>]*>/, newImage);
    }
  
    // Create the payload including title, content, tags, categories, and event-specific fields
    const payload = {
      title, // Add the title to the payload
      content, // This content includes base64 image URLs
      tags: selectedTags,
      categories: selectedCategories, // Add selected categories to the payload
      type: contentType,
      location: contentType === "EVENTS" ? eventLocation : undefined, // Only include for events
      time: contentType === "EVENTS" ? eventTime : undefined, // Only include for events
    };
  
    console.log(payload, "payload");
  
    try {
      // Send the payload to your backend API
      await axios.post("http://localhost:5000/contents", payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      alert("Content saved successfully!");
    } catch (error: any) {
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
    <div className="container mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Content Type Selector */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold">Select Content Type</label>
        <select
          value={contentType}
          onChange={handleContentTypeChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Content Type</option>
          <option value="EVENTS">Events</option>
          <option value="BLOG">Blog</option>
          <option value="NEWS">News</option>
          <option value="CHARITY">Charity</option>
          <option value="OTHER">Other</option>
        </select>

        {/* Event-specific Fields */}
        {contentType === "EVENTS" && (
          <div className="space-y-4">
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Event Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="datetime-local"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Tag Input Component */}
      <TagInput onTagsChange={setSelectedTags} />

      {/* Category Input */}
      <CategoryInput onCategoriesChange={handleCategoryChange} />

      {/* Editor Toolbar */}
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
      <div
        {...getRootProps()}
        className="editor-dropzone w-full bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg"
      >
        <input {...getInputProps()} />
        <EditorContent editor={editor} className="prose max-w-full" />
      </div>

      {/* Submit Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Save Content
        </button>
      </div>
    </div>
  );
};

export default TiptapEditor;
