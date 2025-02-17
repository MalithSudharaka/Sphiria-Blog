import { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="relative w-full">
      {/* Selected categories */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCategories.map((category, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center space-x-2"
          >
            <span>{category}</span>
            <button
              onClick={() => handleRemoveCategory(category)}
              className="text-red-600 hover:text-red-800 focus:outline-none"
            >
              ✖
            </button>
          </span>
        ))}
      </div>

      {/* Input field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search and select categories..."
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown for category suggestions */}
      {showDropdown && filteredCategories.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-auto z-10">
          {filteredCategories.map((category, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
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
