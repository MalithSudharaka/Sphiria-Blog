import { useState, useEffect } from "react";
import axios from "axios";
import "./TagInput.css";

interface TagInputProps {
  onTagsChange: (tags: string[]) => void;
}

const TagInput = ({ onTagsChange }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (inputValue.trim()) {
      fetchSuggestions(inputValue);
      setShowDropdown(true);
    } else {
      setSuggestedTags([]);
      setShowDropdown(false);
    }
  }, [inputValue]);

  // Fetch tag suggestions from the server using axios
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get("http://localhost:5000/tags/suggest", {
        params: { query },
      });

      // Ensure response data is an array of strings
      setSuggestedTags(
        Array.isArray(response.data) ? response.data.map((tag: { name: string }) => tag.name) : []
      );
    } catch (error) {
      console.error("Error fetching tag suggestions:", error);
      setSuggestedTags([]); // Fallback to an empty array in case of error
    }
  };

  const addTag = async (newTag: string) => {
    if (!tags.includes(newTag)) {
      const newTags = [...tags, newTag];

      try {
        await axios.post("http://localhost:5000/tags", { name: newTag });
      } catch (error) {
        console.error("Error adding new tag:", error);
      }

      setTags(newTags);
      onTagsChange(newTags); // ✅ Send updated tags to TiptapEditor
    }

    setInputValue(""); // Clear input
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onTagsChange(newTags); // ✅ Send updated tags to TiptapEditor
  };

  return (
    <div className="tag-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter..."
        className="tag-input"
      />

      {/* Show suggested tags dropdown */}
      {showDropdown && suggestedTags.length > 0 && (
        <div className="suggestions">
          {suggestedTags.map((suggestedTag, index) => (
            <div key={index} className="suggestion-item" onClick={() => addTag(suggestedTag)}>
              {suggestedTag}
            </div>
          ))}
          <span onClick={() => setShowDropdown(false)}>X</span>
        </div>
      )}

      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            <button onClick={() => removeTag(index)} className="remove-tag">✖</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
