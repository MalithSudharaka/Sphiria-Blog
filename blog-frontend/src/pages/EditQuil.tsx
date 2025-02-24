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

export default function EditQuillEditor() {
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
  });

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  useEffect(() => {
    if (location.state?.content) {
      const { content: contentData } = location.state;
      setTitle(contentData.title);
      setSelectedTags(contentData.tags);
      setSelectedCategories(contentData.categories);
      setContentType(contentData.type);
      setEventLocation(contentData.location || "");
      setEventTime(formatDateTimeLocal(contentData.time));
      setThumbnailUrl(contentData.thumbnail);
      setMode(contentData.mode);
      setContent(contentData.content);
      setSeoTitle(contentData.seoTitle || "");
      setMetaDescription(contentData.metaDescription || "");
      setMetaKeywords(contentData.metaKeywords || []);

      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(contentData.content);
      }
    }
  }, [location.state, quill]);

  const formatDateTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = async () => {
    try {
      if (!title || !contentType || !content) {
        alert("Title, content type, and content are required");
        return;
      }

      if (contentType === "EVENTS" && (!eventLocation || !eventTime)) {
        alert("Location and time are required for events");
        return;
      }

      if (seoTitle.length > 60) {
        alert("SEO Title must be 60 characters or less");
        return;
      }

      if (metaDescription.length > 160) {
        alert("Meta Description must be 160 characters or less");
        return;
      }

      if (metaKeywords.length > 10) {
        alert("Maximum 10 meta keywords allowed");
        return;
      }

      const payload = {
        title,
        content,
        tags: selectedTags,
        categories: selectedCategories,
        type: contentType,
        location: contentType === "EVENTS" ? eventLocation : undefined,
        time: contentType === "EVENTS" ? new Date(eventTime).toISOString() : undefined,
        thumbnail: thumbnailUrl,
        mode,
        seoTitle,
        metaDescription,
        metaKeywords
      };

      await axios.put(
        `http://localhost:5000/contents/${location.state.content.id}`,
        payload
      );
      navigate("/");
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating content");
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
        placeholder="Title"
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      />

      <Thumbnail
        onThumbnailUpload={setThumbnailUrl}
        initialThumbnail={thumbnailUrl}
      />

      <select
        value={contentType}
        onChange={(e) => setContentType(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      >
        <option value="">Select Content Type</option>
        <option value="EVENTS">Event</option>
        <option value="BLOG">Blog</option>
        <option value="NEWS">News</option>
        <option value="CHARITY">Charity</option>
        <option value="OTHER">Other</option>
      </select>

      {contentType === "EVENTS" && (
        <div className="mb-4">
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-2 mb-2 border rounded-lg"
          />
          <input
            type="datetime-local"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      )}

      <TagInput
        onTagsChange={setSelectedTags}
        initialTags={selectedTags}
      />

      <CategoryInput
        onCategoriesChange={setSelectedCategories}
        initialCategories={selectedCategories}
      />

      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold mb-2">SEO Settings</h3>

        <div>
          <label className="block text-sm font-medium mb-1">SEO Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={60}
          />
          <p className="text-sm text-gray-500 mt-1">
            {seoTitle.length}/60 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Meta Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={160}
          />
          <p className="text-sm text-gray-500 mt-1">
            {metaDescription.length}/160 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Keywords</label>
          <TagInput
            key={metaKeywords.join(',')}
            onTagsChange={setMetaKeywords}
            initialTags={metaKeywords}
            placeholder="Add keywords (press Enter)"
            maxTags={10}
          />
          <p className="text-sm text-gray-500 mt-1">
            {metaKeywords.length}/10 keywords
          </p>
        </div>
      </div>

      <div
        ref={quillRef}
        className="mb-4 border rounded-lg"
        style={{ height: "400px" }}
      />

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Update Content
      </button>
    </div>
  );
}