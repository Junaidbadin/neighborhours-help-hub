import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../slices/postSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORY_OPTIONS = [
  'Tools & Equipment',
  'Tutoring & Education',
  'Household Chores',
  'Errands & Shopping',
  'Pet Care',
  'Garden & Landscaping',
  'Technology Help',
  'Transportation',
  'Home Repairs',
  'Childcare',
  'Elderly Care',
  'Other',
];

const CreatePost = () => {
  const [postData, setPostData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    address: '',
    latitude: '',
    longitude: '',
    isUrgent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.title.trim() || !postData.description.trim() || !postData.category) {
      toast.error('Title, description, and category are required.');
      return;
    }

    if (postData.description.trim().length < 20) {
      toast.error('Description must be at least 20 characters.');
      return;
    }

    // Build FormData for compatibility with server (multer expects 'image')
    const formData = new FormData();
    formData.append('type', 'Need Help');
    formData.append('title', postData.title.trim());
    formData.append('description', postData.description.trim());
    formData.append('category', postData.category);
    if (postData.budget) formData.append('budget', String(Number(postData.budget)));
    formData.append('isUrgent', String(postData.isUrgent));
    formData.append('contactMethod', 'chat');
    if (postData.latitude && postData.longitude) {
      formData.append('latitude', String(parseFloat(postData.latitude)));
      formData.append('longitude', String(parseFloat(postData.longitude)));
      formData.append('address', postData.address || 'User provided location');
    } else if (postData.address) {
      formData.append('address', postData.address);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    setSubmitting(true);
    try {
      await dispatch(createPost(formData)).unwrap();
      toast.success('Post created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Post dispatch failed:', err);
      const errorMessage =
        err?.payload?.message || err?.message || 'Failed to create post. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📝 Create a New Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image (optional) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setImageFile(file || null);
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(String(reader.result || ''));
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview('');
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-32 w-32 object-cover rounded-lg border"
              />
            )}
          </div>
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              value={postData.title}
              onChange={handleChange}
              placeholder="Enter a catchy title..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={postData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={postData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your post..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            ></textarea>
          </div>
          {/* Budget */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Budget (optional)
            </label>
            <input
              type="number"
              name="budget"
              min="0"
              step="0.01"
              value={postData.budget}
              onChange={handleChange}
              placeholder="Enter a budget in USD"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Address (optional)
            </label>
            <input
              type="text"
              name="address"
              value={postData.address}
              onChange={handleChange}
              placeholder="Street, City"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Latitude (optional)
              </label>
              <input
                type="number"
                name="latitude"
                value={postData.latitude}
                onChange={handleChange}
                placeholder="e.g. 37.7749"
                step="any"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Longitude (optional)
              </label>
              <input
                type="number"
                name="longitude"
                value={postData.longitude}
                onChange={handleChange}
                placeholder="e.g. -122.4194"
                step="any"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          {/* Urgent */}
          <div className="flex items-center space-x-3">
            <input
              id="isUrgent"
              type="checkbox"
              name="isUrgent"
              checked={postData.isUrgent}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isUrgent" className="text-sm text-gray-700">
              Mark as urgent
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Coordinates and address are optional. Provide them to help neighbors locate you faster.
          </p>
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
