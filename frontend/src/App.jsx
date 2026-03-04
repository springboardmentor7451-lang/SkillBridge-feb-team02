import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import AuthModal from "./components/Auth/AuthModal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import NgoDashboard from "./pages/NgoDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import useAuth from "./context/useAuth";

const AppContent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [role, setRole] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user]);

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <main className="bg-zinc-100 min-h-screen overflow-hidden">
      <Navbar openAuthModal={openAuthModal} role={role} />

      <Routes>
        <Route path="/" element={<Hero openAuthModal={openAuthModal} />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo"
          element={
            <ProtectedRoute>
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/volunteer"
          element={
            <ProtectedRoute>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;