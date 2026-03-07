import { useState } from "react";
import { signup } from "../../services/api";
import useAuth from "../../context/useAuth";
import FormField from "../ui/FormField";

const SignupForm = ({ switchToLogin, onSuccess }) => {
  const { loginUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "",
    bio: "",
    location: "",
    skills: [],
    skillInput: "",
    organization_name: "",
    organization_description: "",
    website: "",
    password: "",
    confirmPassword: "",
  });

  const step1Fields = [
    { label: "Full Name", name: "name" },
    { label: "Username", name: "username" },
    { label: "Email", name: "email", type: "email" },
    {
      label: "Role",
      name: "role",
      type: "select",
      options: [
        { label: "Volunteer", value: "volunteer" },
        { label: "NGO", value: "ngo" },
      ],
    },
  ];

  const volunteerFields = [
    { label: "Bio", name: "bio", type: "textarea" },
    { label: "Location", name: "location" },
  ];

  const ngoFields = [
    { label: "Organization Name", name: "organization_name" },
    {
      label: "Organization Description",
      name: "organization_description",
      type: "textarea",
    },
    { label: "Website", name: "website" },
    { label: "Location", name: "location" },
  ];

  const step3Fields = [
    { label: "Password", name: "password", type: "password" },
    { label: "Confirm Password", name: "confirmPassword", type: "password" },
  ];

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
        skillInput: "",
      }));
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!form.name || !form.username || !form.email || !form.role) {
        return "Please fill all required fields.";
      }
    }

    if (step === 2) {
      if (form.role === "volunteer" && !form.bio) {
        return "Bio is required for volunteers.";
      }

      if (
        form.role === "ngo" &&
        (!form.organization_name || !form.organization_description)
      ) {
        return "Organization name and description are required for NGOs.";
      }
    }

    if (step === 3) {
      if (!form.password || !form.confirmPassword) {
        return "Please enter password and confirm it.";
      }

      if (form.password !== form.confirmPassword) {
        return "Passwords do not match.";
      }
    }

    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        role: form.role,
        bio: form.bio,
        location: form.location,
        skills: form.skills.length ? form.skills : undefined,
        organization_name: form.organization_name,
        organization_description: form.organization_description,
        website: form.website,
        password: form.password,
      };

      await signup(payload);

      loginUser({ email: form.email, password: form.password });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="text-sm text-slate-500">Step {step} of 3</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-700 text-sm">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 &&
          step1Fields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}

        {step === 2 && (
          <>
            {(form.role === "volunteer" ? volunteerFields : ngoFields).map(
              (field) => (
                <FormField
                  key={field.name}
                  {...field}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              ),
            )}

            {form.role === "volunteer" && (
              <>
                <FormField
                  label="Add Skill"
                  name="skillInput"
                  value={form.skillInput}
                  onChange={handleChange}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type skill and press Enter"
                />

                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        
        {step === 3 &&
          step3Fields.map((field) => (
            <FormField
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}

        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="w-1/2 border border-slate-300 py-2 rounded-lg"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-slate-900 text-white py-2 rounded-lg"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button onClick={switchToLogin} className="font-medium hover:underline">
          Login
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
