import { useState, useEffect } from "react";
import axios from "axios";
import "./TagInput.css";

interface CategoryInputProps {
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryInput = ({ onCategoriesChange }: CategoryInputProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = categories.filter(
        (cat) =>
          cat.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedCategories.includes(cat)
      );
      setFilteredCategories(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCategories([]);
      setShowDropdown(false);
    }
  }, [inputValue, categories, selectedCategories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(
        Array.isArray(response.data) ? response.data.map((cat: { name: string }) => cat.name) : []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSelectCategory = (category: string) => {
    if (!selectedCategories.includes(category)) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      onCategoriesChange(newCategories); // Send updated categories to parent
    }
    setInputValue("");
    setShowDropdown(false);
  };

  const handleRemoveCategory = (category: string) => {
    const newCategories = selectedCategories.filter((cat) => cat !== category);
    setSelectedCategories(newCategories);
    onCategoriesChange(newCategories); // Send updated categories to parent
  };

  return (
    <div className="category-input-container">
      <div className="selected-categories">
        {selectedCategories.map((category, index) => (
          <span key={index} className="selected-category">
            {category}
            <button onClick={() => handleRemoveCategory(category)} className="remove-category">
              ✖
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search and select categories..."
        className="category-input"
      />

      {showDropdown && filteredCategories.length > 0 && (
        <div className="category-dropdown">
          {filteredCategories.map((category, index) => (
            <div key={index} className="category-item" onClick={() => handleSelectCategory(category)}>
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
