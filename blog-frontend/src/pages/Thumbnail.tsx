import { useState } from "react";
import axios from "axios";

interface ThumbnailProps {
  onThumbnailUpload: (url: string) => void; // Callback to return the Cloudinary URL
}

const Thumbnail = ({ onThumbnailUpload }: ThumbnailProps) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(""); // State to store the uploaded image URL
  const [isUploading, setIsUploading] = useState<boolean>(false); // State to handle loading during upload

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog-post"); // Replace with your Cloudinary upload preset

    try {
      // Upload the image to Cloudinary
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwvrjfdpu/image/upload", // Replace with your Cloudinary cloud name
        formData
      );

      // Set the thumbnail URL and pass it to the parent component
      setThumbnailUrl(response.data.secure_url);
      onThumbnailUpload(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Thumbnail Preview */}
      {thumbnailUrl && (
        <div className="w-full max-w-xs">
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Uploading Indicator */}
      {isUploading && <p className="text-gray-600">Uploading...</p>}
    </div>
  );
};

export default Thumbnail;