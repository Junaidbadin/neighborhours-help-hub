import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Profile = () => {
  // Existing states...
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  // New state for posts
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        // Get current user profile via auth profile or a dedicated endpoint (assuming /api/auth/profile)
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = res.data?.data || res.data;
        setUser(userData);
        setEditData({
          name: userData.name || '',
          email: userData.email || '',
          city: userData.city || '',
          skills: userData.skills?.join(', ') || '',
          profilePic: userData.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        });
        setBio(userData.bio || "");
        setImagePreview(userData.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png");

        // --- Fetch user's posts using correct endpoint ---
        setPostsLoading(true);
        const userId = userData._id;
        const postsRes = await axios.get(
          `http://localhost:5000/api/posts/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const postsArr =
          (postsRes.data && postsRes.data.data && postsRes.data.data.posts) || [];
        setPosts(postsArr);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        setError("Failed to load profile. Please log in again.");
      } finally {
        setLoading(false);
        setPostsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Existing handlers...
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("name", editData.name || "");
      formData.append("city", editData.city || "");
      formData.append("skills", editData.skills || "");
      formData.append("bio", bio || "");
      if (imageFile) formData.append("profilePic", imageFile);

      const res = await axios.put("http://localhost:5000/api/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updated = res.data?.data || res.data;
      setUser(updated);
      setIsEditing(false);
      setError("Profile updated successfully!");
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // --- Rendering ---
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error && error !== "Profile updated successfully!") {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  const displayUser = isEditing ? editData : user;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          👤 My Profile
        </h1>
        {/* Success/Error Message */}
        {error === "Profile updated successfully!" && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* Profile Picture and Details (Existing code) */}
          <img
            src={isEditing ? imagePreview : (displayUser?.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="flex-1 w-full">
            {/* Edit/View Mode (Existing code) */}
            {isEditing ? (
              <form className="space-y-4">
                <InputGroup label="Name" name="name" value={editData.name} onChange={handleInputChange} />
                <InputGroup label="Email (Read-only)" name="email" value={editData.email} disabled={true} />
                <InputGroup label="City" name="city" value={editData.city} onChange={handleInputChange} />
                <InputGroup 
                  label="Skills (Comma-separated)" 
                  name="skills" 
                  value={editData.skills} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Plumbing, Cooking, Driving"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your neighbors about yourself..."
                    rows={4}
                    className="mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-700"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={handleSave} 
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)} 
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-gray-500 mt-1">📍 {user?.city || "City not provided"}</p>
                {user?.bio && (
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">{user.bio}</p>
                )}
                <div className="mt-3">
                  <p className="font-medium text-gray-700">Skills:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user?.skills?.length ? (
                      user.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No skills added</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-yellow-500 font-semibold">⭐ Rating: {user?.rating || "Not rated yet"}</p>
                </div>
                <button 
                  className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
        {/* New Section: My Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 My Posts</h2>
          {postsLoading ? (
            <div className="text-center text-gray-600">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500">No posts created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div key={post._id} className="bg-gray-50 rounded-lg p-4 shadow">
                  {post.image && (
                    <img
                      src={post.image}  // Post image URL
                      alt="Post"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm text-gray-700"><strong>Title:</strong> {post.title}</p>
                  <p className="text-sm text-gray-700"><strong>Description:</strong> {post.description}</p>
                  <p className="text-sm text-gray-700"><strong>Category:</strong> {post.category}</p>
                  <p className="text-sm text-gray-700"><strong>Status:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${post.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.isCompleted ? 'Completed' : 'Open'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component (Existing)
const InputGroup = ({ label, name, value, onChange, disabled = false, placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`mt-1 block w-full rounded-md border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
                  ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`}
    />
  </div>
);

export default Profile;
