import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation
import TiptapEditor from "./TiptapEditor"; // Import the TiptapEditor component

interface ContentItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  categories: string[];
  type: string;
  location?: string; // Optional, only for events
  time?: string; // Optional, only for events
  thumbnail?: string; // Thumbnail URL
}

// Function to extract width and height from Base64 metadata
const extractBase64Metadata = (html: string) => {
  return html.replace(
    /<img[^>]+src="data:image\/[^";]+;base64,[^"]+"/g,
    (match) => {
      // Extract base64 data and dimensions
      const base64Match = match.match(/src="([^"]+)"/);
      if (!base64Match) return match;

      let base64String = base64Match[1];
      const metadataMatch = base64String.match(/\|width:(\d+)\|height:(\d+)$/);

      if (metadataMatch) {
        const width = metadataMatch[1];
        const height = metadataMatch[2];

        // Remove the embedded metadata from the base64 string
        base64String = base64String.split("|width:")[0];

        return match
          .replace(base64Match[1], base64String)
          .replace("<img", `<img width="${width}" height="${height}"`);
      }

      return match; // Return the original if no metadata found
    }
  );
};

const ShowContent: React.FC = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // For navigation

  // Fetch content from the backend
  const fetchContent = async () => {
    try {
      const response = await axios.get<ContentItem[]>(
        "http://localhost:5000/contents"
      );
      setContentList(response.data);
    } catch (err) {
      setError("Failed to load content. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit button click
  const handleEdit = (content: ContentItem) => {
    // Navigate to the TiptapEditor with the content's data
    navigate("/edit-content", { state: { content } });
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
        Saved Content
      </h2>

      {/* Loading and error messages */}
      {loading && <p className="text-lg text-gray-600">Loading...</p>}
      {error && <p className="text-lg text-red-600">{error}</p>}

      {/* Display message when no content is available */}
      {contentList.length === 0 && !loading && (
        <p className="text-lg text-gray-600">No content available.</p>
      )}

      {/* Content list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
            {/* Thumbnail Image */}
            {item.thumbnail && (
              <div className="mb-4">
                <img
                  src={item.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>
            )}

            <div className="content p-6">
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title} <span className="text-xs text-red-600 font-thin">{`/ ${item.type}`}</span>
              </h3>

              {/* Content with embedded image width and height */}
              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: extractBase64Metadata(item.content),
                }}
              />

              {/* Tags */}
              <div className="mt-4">
                <strong className="text-gray-700">Tags:</strong>
                {item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tags available</p>
                )}
              </div>

              {/* Categories */}
              <div className="mt-4">
                <strong className="text-gray-700">Categories:</strong>
                {item.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-200 text-green-800 text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </div>

              {/* Additional information */}
              {/* <div className="mt-4 text-sm text-gray-500">
                <p>
                  Created on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div> */}

              {/* Edit button */}
              {/* <button
                onClick={() => handleEdit(item)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Edit
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowContent;
