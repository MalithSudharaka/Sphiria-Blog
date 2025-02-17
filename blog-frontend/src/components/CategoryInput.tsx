import { useEffect, useState } from "react";
import axios from "axios";
import "./TagInput.css";

interface CategoryInputProps {
  onCategoryChange: (category: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<string[]>("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = categories.filter((category) =>
        category.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredCategories([]);
      setShowDropdown(false);
    }
  }, [inputValue, categories]);

  const handleSelectCategory = (category: string) => {
    setInputValue(category);
    onCategoryChange(category);
    setShowDropdown(false);
  };

  return (
    <div className="category-input-container">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search category..."
        className="category-input"
      />
      {showDropdown && (
        <div className="suggestions">
          {filteredCategories.map((category, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSelectCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
