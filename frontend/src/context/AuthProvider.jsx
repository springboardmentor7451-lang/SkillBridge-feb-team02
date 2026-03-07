import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { getUserProfile, login } from "../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile();
        setUser(profile.userData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);

      localStorage.setItem("token", response.token);
      const profile = await getUserProfile();

      setUser(profile.userData);

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
