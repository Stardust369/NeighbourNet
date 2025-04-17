import React, { useState, useRef, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LocationPicker from "../components/LocationPicker";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);

  const tagDropdownRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
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

  const uploadFiles = async (list) => {
    const storage = getStorage(app);
    const results = [];
    for (let item of list) {
      const fileName = `${Date.now()}-${item.file.name}`;
      const storageRef = ref(storage, fileName);
      const task = uploadBytesResumable(storageRef, item.file);
      await new Promise((resolve) => {
        task.on(
          "state_changed",
          null,
          () => {
            results.push({ ...item, error: "Upload failed" });
            resolve();
          },
          () => {
            getDownloadURL(task.snapshot.ref).then((url) => {
              results.push({ url, fileName });
              resolve();
            });
          }
        );
      });
    }
    return results;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageUploading(true);
    const list = files.map((file) => ({ file }));
    const uploaded = await uploadFiles(list);
    setImages((prev) => [...prev, ...uploaded]);
    setImageUploading(false);
    setImageUploadSuccess(true);
    setTimeout(() => setImageUploadSuccess(false), 3000);
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setVideoUploading(true);
    const list = files.map((file) => ({ file }));
    const uploaded = await uploadFiles(list);
    setVideos((prev) => [...prev, ...uploaded]);
    setVideoUploading(false);
    setVideoUploadSuccess(true);
    setTimeout(() => setVideoUploadSuccess(false), 3000);
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
      const body = {
        ...formData,
        images: images.map((i) => ({ url: i.url })),
        videos: videos.map((v) => ({ url: v.url })),
        postedBy: user._id,
      };

      const res = await fetch("http://localhost:3000/api/v1/issues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) navigate("/dashboard");
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
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={handleQuillChange}
              placeholder="Describe the issue in detail..."
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={[
                'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent', 'link', 'image',
              ]}
              className="bg-white"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Location / Address</label>
            <LocationPicker
              eventLocation={formData.issueLocation}
              setEventLocation={(loc) => setFormData({ ...formData, issueLocation: loc })}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block font-medium mb-1">Images</label>
            <button
              type="button"
              onClick={() => imageInputRef.current.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={imageUploading}
            >
              {imageUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Images'
              )}
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageUpload}
            />
            {imageUploadSuccess && (
              <p className="text-green-600 mt-2">Images uploaded successfully!</p>
            )}
          </div>

          {/* Video Upload Section */}
          <div>
            <label className="block font-medium mb-1">Videos</label>
            <button
              type="button"
              onClick={() => videoInputRef.current.click()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={videoUploading}
            >
              {videoUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Videos'
              )}
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={handleVideoUpload}
            />
            {videoUploadSuccess && (
              <p className="text-green-600 mt-2">Videos uploaded successfully!</p>
            )}
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
