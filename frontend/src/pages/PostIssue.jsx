import React, { useState, useRef, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LocationPicker from "../components/LocationPicker";
import RichTextEditor from "../components/RichTextEditor";

const issueTags = ["Road", "Water", "Electricity", "Education", "Health", "Sanitation"];

export default function PostIssue() {
  const [formData, setFormData] = useState({
    title: "",
    tags: [],
    content: "",
    issueLocation: "",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const tagDropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Close tag dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tagDropdownRef]);

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const list = files.map((file) => ({ file, progress: null, url: null, error: null }));
    if (type === "image") setImages((prev) => [...prev, ...list]);
    else setVideos((prev) => [...prev, ...list]);
  };

  const uploadFiles = async (list) => {
    const storage = getStorage(app);
    const updated = await Promise.all(
      list.map((item) =>
        new Promise((resolve) => {
          const fileName = `${Date.now()}-${item.file.name}`;
          const storageRef = ref(storage, fileName);
          const task = uploadBytesResumable(storageRef, item.file);

          task.on(
            "state_changed",
            () => {},
            () => resolve({ ...item, error: "Upload failed" }),
            () => {
              getDownloadURL(task.snapshot.ref).then((url) => {
                resolve({ ...item, url, progress: null, error: null });
              });
            }
          );
        })
      )
    );
    return updated;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.tags.length === 0 || !formData.content || !formData.issueLocation) {
      setPublishError("Please fill in all required fields.");
      return;
    }

    setPublishError(null);
    setIsSubmitting(true);
    try {
      const uploadedImages = await uploadFiles(images);
      const uploadedVideos = await uploadFiles(videos);

      const body = {
        ...formData,
        images: uploadedImages.map((i) => ({ url: i.url })),
        videos: uploadedVideos.map((v) => ({ url: v.url })),
        postedBy: user._id,
      };

      const res = await fetch("/api/v1/issues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (res.ok) navigate("/issues");
      else setPublishError("Failed to post issue.");
    } catch {
      setPublishError("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Post an Issue</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">Title</label>
            <input
              id="title"
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Issue title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Tags Dropdown */}
          <div className="relative">
            <label className="block font-medium mb-1">Tags</label>
            <div
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className="w-full border border-gray-300 rounded p-2 flex flex-wrap gap-2 cursor-pointer"
            >
              {formData.tags.length > 0 ? (
                formData.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Select tags...</span>
              )}
            </div>
            {showTagDropdown && (
              <div
                ref={tagDropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto"
              >
                {issueTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag)}
                      readOnly
                      className="mr-2"
                    />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <RichTextEditor content={formData.content} onChange={handleQuillChange} />
          </div>

          <div>
            <label className="block font-medium mb-1">Location / Address</label>
            <LocationPicker
              eventLocation={formData.issueLocation}
              setEventLocation={(loc) => setFormData({ ...formData, issueLocation: loc })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, "image")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, "video")}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded text-white font-semibold ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Posting..." : "Post Issue"}
          </button>

          {publishError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mt-2 text-center">
              {publishError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}