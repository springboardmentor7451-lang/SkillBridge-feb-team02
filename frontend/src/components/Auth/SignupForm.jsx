import React, { useState } from "react";
import { signup } from "../../services/api";

const SignupForm = ({ onSuccess, switchToLogin }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    username:"",
    email: "",
    password: "",
    role: "volunteer", // default role
    skills: [], // for volunteer
    bio: "", // for volunteer
    location: "",
    organization_name: "", // for ngo
    organization_description: "", // for ngo
    website: "", // for ngo
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e) => {
    // Simple comma-separated string to array for now
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    setFormData({ ...formData, skills: skillsArray });
  };

  const validateStep1 = () => {
    const required = ["name", "email", "password", "role"];
    for (const field of required) {
      if (!formData[field]) {
        setError(`Please fill in ${field}`);
        return false;
      }
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signup(formData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        onSuccess(data);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center my-auto">
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
          Create Account
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          {step === 1 ? "Step 1: Basic Information" : "Step 2: Profile Details"}
        </p>
      </div>

      <form
        className="flex flex-col gap-4 grow overflow-y-auto px-1"
        onSubmit={handleSubmit}
      >
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-2 gap-3" >
            <label className="text-sm font-semibold text-slate-600 ml-1">
              Full Name
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="text-sm font-semibold text-slate-600 ml-1">
              Username
              <input
                type="text"
                name="username"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                placeholder="johnoe123"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            </div>

            <label className="text-sm font-semibold text-slate-600 ml-1">
              Email Address
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-600 ml-1">
              Password
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <label className="text-sm font-semibold text-slate-600 ml-1">
              I am a
              <select
                name="role"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base appearance-none cursor-pointer"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO</option>
              </select>
            </label>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-600 ml-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {formData.role === "volunteer" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600 ml-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base resize-none"
                    placeholder="Tell us about yourself"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600 ml-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skillsInput" // uncontrolled input helper
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                    placeholder="Teaching, Coding, Cooking"
                    onChange={handleSkillsChange}
                  />
                </div>
              </>
            )}

            {formData.role === "ngo" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600 ml-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organization_name"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                    placeholder="Your Organization"
                    value={formData.organization_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <label className="text-sm font-semibold text-slate-600 ml-1">
                  Description
                  <textarea
                    name="organization_description"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base resize-none"
                    placeholder="What does your NGO do?"
                    rows="2"
                    value={formData.organization_description}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="text-sm font-semibold text-slate-600 ml-1">
                  Website
                  <input
                    type="text"
                    name="website"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-sm md:text-base"
                    placeholder="https://example.org"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </label>
              </>
            )}
          </div>
        )}
        <div className=" flex flex-col gap-3 shrink-0">
          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Next
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading}
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 shrink-0">
        Already have an account?
        <button
          className="text-indigo-600 font-semibold cursor-pointer border-none bg-transparent ml-1 hover:underline p-0"
          onClick={switchToLogin}
          type="button"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
