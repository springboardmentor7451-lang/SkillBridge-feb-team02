import React, { useEffect, useState } from "react";
import { getUserProfile } from "../services/api";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                if (data.success) {
                    setUser(data.userData);
                } else {
                    setError("Failed to load profile");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
                {error}
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="w-[90%] mt-30  mx-auto p-6 bg-white rounded-3xl shadow-lg border border-slate-100">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile Header / Left Column */}
                <div className="shrink-0 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-4xl border-4 border-indigo-50">
                        {user.username ? user.username[0].toUpperCase() : "U"}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-slate-500 text-sm">@{user.username}</p>
                    <span className="mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wide">
                        {user.role}
                    </span>
                </div>

                {/* Details / Right Column */}
                <div className="grow w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                                <p className="text-slate-800 font-medium">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                                <p className="text-slate-800 font-medium">{user.location || "Not specified"}</p>
                            </div>
                        </div>
                    </div>

                    {user.role === "volunteer" && (
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">Volunteer Profile</h3>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bio</label>
                                    <p className="text-slate-700 leading-relaxed">{user.bio}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {user.skills && user.skills.length > 0 ? (
                                            user.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 text-sm italic">No skills listed</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {user.role === "ngo" && (
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">Organization Details</h3>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization Name</label>
                                    <p className="text-slate-800 font-medium">{user.organization_name}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                                    <p className="text-slate-700 leading-relaxed">{user.organization_description}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</label>
                                    <p className="text-indigo-600 font-medium hover:underline">
                                        {user.website ? (
                                            <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a>
                                        ) : (
                                            <span className="text-slate-400 italic">Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
