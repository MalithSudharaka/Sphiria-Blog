import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import ShowContent from "./components/ShowContent";
import "quill/dist/quill.snow.css"; // Snow theme (or "quill.bubble.css" for bubble theme)


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<ShowContent />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
