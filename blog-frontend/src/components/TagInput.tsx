import { useState, useEffect } from "react";
import axios from "axios";

interface TagInputProps {
  onTagsChange: (tags: string[]) => void;
  initialTags?: string[]; // Add initialTags prop
  placeholder:string
}

const TagInput = ({ onTagsChange, initialTags = [],placeholder }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(initialTags); // Initialize with initialTags
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
        Array.isArray(response.data)
          ? response.data.map((tag: { name: string }) => tag.name)
          : []
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
      onTagsChange(newTags); // Send updated tags to parent
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
    onTagsChange(newTags); // Send updated tags to parent
  };

  return (
    <div className="space-y-2">
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Suggested Tags Dropdown */}
      {showDropdown && suggestedTags.length > 0 && (
        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          {suggestedTags.map((suggestedTag, index) => (
            <div
              key={index}
              onClick={() => addTag(suggestedTag)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestedTag}
            </div>
          ))}
          <div
            onClick={() => setShowDropdown(false)}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            Close
          </div>
        </div>
      )}

      {/* Tag List */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-blue-800 hover:text-blue-900 focus:outline-none"
            >
              ✖
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
