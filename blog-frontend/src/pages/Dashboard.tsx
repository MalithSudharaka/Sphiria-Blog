import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Update with your API URL

export default function Dashboard() {
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editTag, setEditTag] = useState<{ id: string; name: string } | null>(null);
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);

  // Fetch Tags & Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsRes = await axios.get(`${API_BASE_URL}/tags`);
        const categoriesRes = await axios.get(`${API_BASE_URL}/categories`);
        setTags(tagsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Add Tag
  const addTag = async () => {
    if (!newTag.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/tags`, { name: newTag });
      setTags((prevTags) => [...prevTags, res.data.tag]); // Update state with new tag
      setNewTag("");
      setEditTag(null); // Reset editTag after adding a tag
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  // Add Category
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/categories`, { name: newCategory });
      setCategories([...categories, res.data]); // Update state
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Update Tag
  const updateTag = async () => {
    if (!editTag) return;
    try {
      await axios.patch(`${API_BASE_URL}/tags/${editTag.id}`, { name: editTag.name });
      setTags(tags.map(tag => (tag.id === editTag.id ? editTag : tag))); // Update state
      setEditTag(null);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  // Update Category
  const updateCategory = async () => {
    if (!editCategory) return;
    try {
      await axios.patch(`${API_BASE_URL}/categories/${editCategory.id}`, { name: editCategory.name });
      setCategories(categories.map(category => (category.id === editCategory.id ? editCategory : category)));
      setEditCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete Tag
  const deleteTag = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/tags/${id}`);
      setTags(tags.filter(tag => tag.id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  // Delete Category
  const deleteCategory = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
      setCategories(categories.filter(category => category.id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Manage Tags & Categories</h2>

      {/* Tags Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-xl font-medium mb-2">Tags</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter tag name"
            className="border p-2 rounded w-full"
          />
          <button onClick={addTag} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Tag Name</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  {editTag?.id === tag.id ? (
                    <input
                      type="text"
                      value={editTag ? editTag.name : ""} // Ensure this doesn't try to access 'name' if editTag is null
                      onChange={(e) => setEditTag({ ...editTag!, name: e.target.value })}
                      className="border p-1 rounded"
                    />
                  ) : (
                    tag.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editTag?.id === tag.id ? (
                    <button onClick={updateTag} className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setEditTag(tag)} className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600">
                        Edit
                      </button>
                      <button onClick={() => deleteTag(tag.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Categories Section */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-xl font-medium mb-2">Categories</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="border p-2 rounded w-full"
          />
          <button onClick={addCategory} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Category Name</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  {editCategory?.id === category.id ? (
                    <input
                      type="text"
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                      className="border p-1 rounded"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {editCategory?.id === category.id ? (
                    <button onClick={updateCategory} className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => setEditCategory(category)} className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600">
                        Edit
                      </button>
                      <button onClick={() => deleteCategory(category.id)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
