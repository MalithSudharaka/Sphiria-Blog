import React, { useEffect, useRef, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize";
import Quill from "quill";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import TagInput from "./../components/TagInput";
import CategoryInput from "./../components/CategoryInput";
import Thumbnail from "./Thumbnail";

Quill.register("modules/imageResize", ImageResize);

export default function QuillEditor() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contentType, setContentType] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mode, setMode] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      imageResize: {
        modules: ["Resize", "DisplaySize"],
      },
    },
    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "color",
      "script",
      "size",
      "font",
      "background",
      "align",
      "direction",
      "code-block",
      "code"
    ]
  });

  useEffect(() => {
    if (location.state?.content) {
      const { content: contentData } = location.state;
      setTitle(contentData.title);
      setSelectedTags(contentData.tags);
      setSelectedCategories(contentData.categories);
      setContentType(contentData.type);
      setEventLocation(contentData.location || "");
      setEventTime(contentData.time || "");
      setThumbnailUrl(contentData.thumbnail || "");
      setMode(contentData.mode || "DRAFT");
      setSeoTitle(contentData.seoTitle || "");
      setMetaDescription(contentData.metaDescription || "");
      setMetaKeywords(contentData.metaKeywords || []);

      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(contentData.content);
      }
    }
  }, [location.state, quill]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const htmlContent = quill.root.innerHTML;
        setContent(htmlContent);
      });
    }
  }, [quill]);

  const saveDraft = async () => {
    try {
      if (quill) {
        const htmlContent = quill.root.innerHTML;
        setContent(htmlContent);

        const draft = {
          title,
          content: htmlContent,
          tags: selectedTags,
          categories: selectedCategories,
          type: contentType,
          location: eventLocation,
          time: eventTime,
          thumbnail: thumbnailUrl,
          mode,
          seoTitle,
          metaDescription,
          metaKeywords,
        };

        if (!draft.title || !draft.content || !draft.type) {
          console.error("Error: Missing required fields in the draft!");
          return;
        }

        await axios.post("http://localhost:5000/contents", draft);
        alert("Draft saved successfully!");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("An error occurred while saving the draft.");
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
      saveDraft();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    title,
    content,
    selectedTags,
    selectedCategories,
    contentType,
    eventLocation,
    eventTime,
    thumbnailUrl,
    mode,
  ]);

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
        thumbnail: thumbnailUrl,
        mode,
        seoTitle,
        metaDescription,
        metaKeywords,
      };
      await axios.post("http://localhost:5000/contents", payload);
      alert("Content saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting content:", error);
      alert("An error occurred while saving content.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "DRAFT" | "PUBLISHED")}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Thumbnail Image
        </label>
        <Thumbnail
          onThumbnailUpload={setThumbnailUrl}
          initialThumbnail={thumbnailUrl}
        />
      </div>

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

      <TagInput
        onTagsChange={setSelectedTags}
        initialTags={selectedTags}
        placeholder="Add Tags (press Enter)"
      />

      <CategoryInput
        onCategoriesChange={setSelectedCategories}
        initialCategories={selectedCategories}
      />

      <div
        ref={quillRef as React.RefObject<HTMLDivElement>}
        className="mb-6 border border-gray-300 rounded-lg overflow-hidden"
        style={{ height: "400px" }}
      />

      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold">SEO Settings</h3>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder="SEO Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Meta Description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">Meta Keywords</label>
          <TagInput
            onTagsChange={setMetaKeywords}
            initialTags={metaKeywords}
            placeholder="Add keywords (press Enter)"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {mode === "DRAFT" ? "Save Draft" : "Publish Content"}
      </button>
    </div>
  );
}