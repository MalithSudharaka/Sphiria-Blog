import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ContentItem {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const ShowContent: React.FC = () => {
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content from the backend
  const fetchContent = async () => {
    try {
      const response = await axios.get<ContentItem[]>('http://localhost:5000/contents');
      setContentList(response.data);
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Saved Content</h2>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {contentList.length === 0 && !loading && (
        <p className="text-gray-600">No content available.</p>
      )}
      <div className="space-y-6">
        {contentList.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
            <div className="mt-4">
              <strong className="text-gray-700">Tags:</strong>
              {item.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tags available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowContent;