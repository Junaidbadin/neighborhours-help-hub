import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const [user, setUser] = useState({
    name: "",
    city: "",
    skills: "",
    profilePic: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: res.data.name || "",
          city: res.data.city || "",
          skills: res.data.skills?.join(", ") || "",
          profilePic: res.data.profilePic || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("accessToken");

      // prepare data
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("city", user.city);
      formData.append("skills", user.skills);
      if (imageFile) formData.append("profilePic", imageFile);

      // send update request
      const res = await axios.put("http://localhost:5000/api/users/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("Profile updated successfully!");
      setUser({
        ...user,
        profilePic: res.data.profilePic || user.profilePic,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          ✏️ Edit Profile
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <img
                src={
                  user.profilePic ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-700"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={user.skills}
                onChange={handleChange}
                placeholder="e.g., Plumbing, Cooking, Tutoring"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition w-full"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

















