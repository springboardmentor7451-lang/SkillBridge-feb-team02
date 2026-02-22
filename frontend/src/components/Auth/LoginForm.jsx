import React, { useState } from "react";
import useAuth from "../../context/useAuth";
import FormField from "../../components/ui/FormField";

const LoginForm = ({ switchToSignup, onSuccess }) => {
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
  ];

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    if (!form.email || !form.password) {
      return "Please enter both email and password.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginUser({
        email: form.email,
        password: form.password,
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-sm text-slate-500 mt-1">Login to your account</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-700 text-sm">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            {...field}
            value={form[field.name]}
            onChange={handleChange}
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium transition-colors hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <button
          onClick={switchToSignup}
          className="font-medium hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
