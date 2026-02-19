import React, { useState } from "react";
import { login } from "../../services/api";

const LoginForm = ({ onSuccess, switchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const data = await login(formData);
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("auth-change"));
        onSuccess(data);
      } else {
        setError(data.message || "Login failed");
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
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-slate-500">Log in to your account</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">
            Email Address
            <input
              type="email"
              name="email"
              className="w-full px-5 py-3 rounded-full border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-base"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}

            />
          </label>
        </div>

        <label className="text-sm font-semibold text-slate-600 ml-1">
          Password
          <div className="relative flex items-center">
            <input
              type="password"
              name="password"
              className="w-full px-5 py-3 rounded-full border-2 border-slate-200 focus:border-indigo-500 focus:bg-white bg-slate-50 outline-none transition-all text-base"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}

            />
          </div>
        </label>

        {error && (
          <div className="text-red-500 text-sm mt-1 text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?
        <button
          className="text-indigo-600 font-semibold cursor-pointer border-none bg-transparent ml-1 hover:underline p-0"
          onClick={switchToSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
