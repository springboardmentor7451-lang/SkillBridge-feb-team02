import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import  opportunityService  from "../services/opportunityService";

const EditOpportunity = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        required_skills: [],
        duration: "",
        location: "",
        status: "open"
    });
    const [skillInput, setSkillInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (location.state && location.state.opportunity) {
            const opp = location.state.opportunity;
            setFormData({
                title: opp.title || "",
                description: opp.description || "",
                required_skills: opp.required_skills || [],
                duration: opp.duration || "",
                location: opp.location || "",
                status: opp.status || "open"
            });
            setIsLoading(false);
        } else {
            setErrorMessage("No opportunity data found. Please return to the dashboard and try again.");
            setIsLoading(false);
        }
    }, [location.state]);

    if (user?.role !== "ngo") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Not Authorized</h1>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-slate-500">Loading opportunity data...</p>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const skill = skillInput.trim();
            if (skill && !formData.required_skills.includes(skill)) {
                setFormData({
                    ...formData,
                    required_skills: [...formData.required_skills, skill]
                });
                setSkillInput("");
            }
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            required_skills: formData.required_skills.filter(s => s !== skillToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                required_skills: formData.required_skills,
                duration: formData.duration,
                location: formData.location,
                status: formData.status
            };

            await opportunityService.update(id, payload);
            setSuccessMessage("Opportunity updated successfully!");

            setTimeout(() => {
                navigate("/ngo");
            }, 1000);
        } catch (err) {
            setErrorMessage(err.message || "Failed to update opportunity");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-100 flex justify-center items-center py-20 px-4 pt-32">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Opportunity</h2>

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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills</label>
                        <div className="w-full p-2 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-slate-900 bg-white">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.required_skills.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-slate-400 hover:text-slate-600 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                className="w-full bg-transparent outline-none p-1 text-slate-700"
                                placeholder="Type a skill and press Enter"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Press enter to add multiple skills</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 mt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate("/ngo")}
                            className="px-6 py-3 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
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
    );
};

export default EditOpportunity;
