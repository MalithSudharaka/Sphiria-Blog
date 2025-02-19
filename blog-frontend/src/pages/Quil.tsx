import React, { useEffect, useRef, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css"; // Quill Theme
import ImageResize from "quill-image-resize"; // Import the image resize module
import Quill from "quill";
import axios from "axios";
import TagInput from "./../components/TagInput";
import CategoryInput from "./../components/CategoryInput";
import Thumbnail from "./Thumbnail"; // Import the Thumbnail component

Quill.register("modules/imageResize", ImageResize);

export default function QuillEditor() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contentType, setContentType] = useState(""); // State for content type
  const [eventLocation, setEventLocation] = useState(""); // State for event location
  const [eventTime, setEventTime] = useState(""); // State for event time
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // State for thumbnail URL

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // Basic formatting
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
        [{ indent: "-1" }, { indent: "+1" }], // Indentation
        [{ direction: "rtl" }], // Text direction
        [{ size: ["small", false, "large", "huge"] }], // Font size
        [{ color: [] }, { background: [] }], // Text and background color
        [{ font: [] }], // Font family
        [{ align: [] }], // Text alignment
        ["link", "image", "video"], // Media and links
        ["clean"], // Remove formatting
      ],
      imageResize: {
        modules: ["Resize", "DisplaySize"],
      },
    },
  });

  // Handle image upload via file input
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          const range = quill.getSelection();
          quill.insertEmbed(range?.index || 0, "image", imageUrl, "user");
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Handle drag-and-drop image upload
  useEffect(() => {
    const editorContainer = quillRef.current;
    if (!editorContainer || !quill) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      editorContainer.classList.add("drag-over"); // Add a class for styling
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      editorContainer.classList.remove("drag-over"); // Remove the class
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      editorContainer.classList.remove("drag-over"); // Remove the class

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            const imageUrl = reader.result as string;
            const range = quill.getSelection();
            quill.insertEmbed(range?.index || 0, "image", imageUrl, "user");
          };
          reader.readAsDataURL(file);
        }
      }
    };

    editorContainer.addEventListener("dragover", handleDragOver);
    editorContainer.addEventListener("dragleave", handleDragLeave);
    editorContainer.addEventListener("drop", handleDrop);

    return () => {
      editorContainer.removeEventListener("dragover", handleDragOver);
      editorContainer.removeEventListener("dragleave", handleDragLeave);
      editorContainer.removeEventListener("drop", handleDrop);
    };
  }, [quill]);

  // Handle content changes
  useEffect(() => {
    if (quill) {
      // Handle image upload
      const toolbar = quill.getModule("toolbar");

      // Set initial content
      quill.clipboard.dangerouslyPasteHTML(content);
    }
  }, [quill]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const payload = {
        title,
        content,
        tags: selectedTags,
        categories: selectedCategories,
        type: contentType,
        location: contentType === "EVENTS" ? eventLocation : undefined,
        time: contentType === "EVENTS" ? eventTime : undefined,
        thumbnail: thumbnailUrl, // Include the thumbnail URL in the payload
      };
      await axios.post("http://localhost:5000/contents", payload);
      alert("Content saved successfully!");
    } catch (error) {
      console.error("Error submitting content:", error);
      alert("An error occurred while saving content.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Thumbnail Upload */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Thumbnail Image</label>
        <Thumbnail onThumbnailUpload={setThumbnailUrl} />
      </div>

      {/* Content Type Selector */}
      <select
        value={contentType}
        onChange={(e) => setContentType(e.target.value)}
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mb-6">
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            placeholder="Event Location"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Tag Input Component */}
      <TagInput onTagsChange={setSelectedTags} />

      {/* Category Input Component */}
      <CategoryInput onCategoriesChange={setSelectedCategories} />

      {/* Quill Editor */}
      <div
        ref={quillRef as React.RefObject<HTMLDivElement>}
        className="mb-6 border border-gray-300 rounded-lg overflow-hidden"
        style={{ height: "400px" }}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </div>
  );
}