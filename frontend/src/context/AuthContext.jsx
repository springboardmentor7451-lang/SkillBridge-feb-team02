import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Use null for no user, object for user data
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState("login"); // 'login' or 'signup'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = (token, userData = {}) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        setUser({ token, ...userData });
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = "/"; // Hard reload to clear any other state if needed, or just navigate
    };

    const openAuthModal = (mode = "login") => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
