import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import api from "../services/api";

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    skills: "",
    organizationDetails: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        bio: user.bio || "",
        skills: user.skills ? user.skills.join(", ") : "",
        organizationDetails: user.organizationDetails || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        location: formData.location,
        bio: formData.bio,
      };

      if (user?.role === "volunteer") {
        payload.skills = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      } else if (user?.role === "ngo") {
        payload.organizationDetails = formData.organizationDetails;
      }

      await api.put("/users/me", payload);

      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        // Force a page reload to ensure the context pulls the latest user info
        window.location.href = "/profile";
      }, 1500);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
            <p className="text-slate-500">Update your account information</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            {user?.role === "volunteer" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. Web Development, UI/UX"
                />
              </div>
            )}

            {user?.role === "ngo" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Organization Details</label>
                <textarea
                  name="organizationDetails"
                  value={formData.organizationDetails}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Describe your organization's mission and goals..."
                ></textarea>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-lg font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfileEdit;