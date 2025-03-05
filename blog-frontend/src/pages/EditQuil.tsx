import React, { useEffect, useState } from "react";
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
    ],
  });

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  useEffect(() => {
    const initializeContent = () => {
      if (location.state?.content) {
        const { content: contentData } = location.state;
        setTitle(contentData.title);
        setSelectedTags(contentData.tags);
        setSelectedCategories(contentData.categories);
        setContentType(contentData.type);
        setEventLocation(contentData.location || "");
        setEventTime(formatDateTimeLocal(contentData.time));
        setThumbnailUrl(contentData.thumbnail || "");
        setMode(contentData.mode || "DRAFT");
        setSeoTitle(contentData.seoTitle || "");
        setMetaDescription(contentData.metaDescription || "");
        setMetaKeywords(contentData.metaKeywords || []);

        if (quill && contentData.content) {
          quill.clipboard.dangerouslyPasteHTML(contentData.content);
        }
      }
    };

    initializeContent();
  }, [location.state, quill]);

  const formatDateTimeLocal = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const saveDraft = async () => {
    try {
      if (!quill) return;

      const htmlContent = quill.root.innerHTML;
      const draft = {
        title,
        content: htmlContent,
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

      if (!draft.title || !draft.content || !draft.type) {
        console.warn("Draft missing required fields");
        return;
      }

      const url = location.state?.content?.id
        ? `http://localhost:5000/contents/${location.state.content.id}`
        : "http://localhost:5000/contents";

      await axios({
        method: location.state?.content?.id ? "put" : "post",
        url,
        data: { ...draft, mode: "DRAFT" },
      });
      console.log("Draft autosaved successfully");
    } catch (error) {
      console.error("Draft save error:", error);
    }
  };

  useEffect(() => {
    const autosaveInterval = setInterval(saveDraft, 30000);
    return () => clearInterval(autosaveInterval);
  }, [saveDraft]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      saveDraft();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveDraft]);

  const handleSubmit = async (publish: boolean = false) => {
    try {
      if (!validateForm()) return;

      const payload = {
        title,
        content,
        tags: selectedTags,
        categories: selectedCategories,
        type: contentType,
        location: contentType === "EVENTS" ? eventLocation : undefined,
        time:
          contentType === "EVENTS"
            ? new Date(eventTime).toISOString()
            : undefined,
        thumbnail: thumbnailUrl,
        mode: publish ? "PUBLISHED" : mode,
        seoTitle,
        metaDescription,
        metaKeywords,
      };

      const method = location.state?.content?.id ? "put" : "post";
      const url = location.state?.content?.id
        ? `http://localhost:5000/contents/${location.state.content.id}`
        : "http://localhost:5000/contents";

      await axios[method](url, payload);
      navigate("/", { state: { refresh: true } });
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving content. Check console for details.");
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!title) errors.push("Title is required");
    if (!contentType) errors.push("Content type is required");
    if (!content) errors.push("Content is required");

    if (contentType === "EVENTS") {
      if (!eventLocation) errors.push("Event location is required");
      if (!eventTime) errors.push("Event time is required");
    }

    if (seoTitle.length > 60) errors.push("SEO Title must be ≤60 characters");
    if (metaDescription.length > 160)
      errors.push("Meta Description must be ≤160 characters");
    if (metaKeywords.length > 10)
      errors.push("Maximum 10 meta keywords allowed");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {location.state?.content?.id ? "Edit Content" : "New Content"}
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <Thumbnail
            onThumbnailUpload={setThumbnailUrl}
            initialThumbnail={thumbnailUrl}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Content Type *
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Content Type</option>
            <option value="EVENTS">Event</option>
            <option value="BLOG">Blog Post</option>
            <option value="NEWS">News Article</option>
            <option value="CHARITY">Charity</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {contentType === "EVENTS" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Location *
              </label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Event location"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <TagInput
            key={selectedTags.join(",")} // Add key to force re-render
            onTagsChange={setSelectedTags}
            initialTags={selectedTags}
            placeholder="Add tags (press Enter)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categories</label>
          <CategoryInput
            key={selectedCategories.join(",")} // Add key to force re-render
            onCategoriesChange={setSelectedCategories}
            initialCategories={selectedCategories}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Content Editor *
          </label>
          <div
            ref={quillRef}
            className="border rounded-lg"
            style={{ height: "400px" }}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">SEO Settings</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Title ({seoTitle.length}/60)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO Title"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              maxLength={60}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Description ({metaDescription.length}/160)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Meta description"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={160}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Keywords ({metaKeywords.length}/10)
            </label>
            <TagInput
              onTagsChange={setMetaKeywords}
              initialTags={metaKeywords}
              placeholder="Add keywords (press Enter)"
              maxTags={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
