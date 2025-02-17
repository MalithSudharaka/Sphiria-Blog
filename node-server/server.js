import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Increase payload size limit
app.use(express.json({ limit: "50mb" })); // Adjust as needed
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Enable CORS
app.use(cors());

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schema & Model
const contentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

// Route to save content
app.post("/save-content", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const newContent = await Content.create({ content });
    res.json({ message: "Content saved successfully!", data: newContent });
  } catch (error) {
    res.status(500).json({ error: "Failed to save content" });
  }
});

// Assuming the backend returns HTML content stored in the `content` field
app.get("/save-content", async (req, res) => {
  try {
    const contents = await Content.find(); // This fetches all content from your database
    const contentHtml = contents.map((content) => content.content); // `content` should be HTML string
    res.json(contentHtml); // Return the content as an array of HTML strings
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve content" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
