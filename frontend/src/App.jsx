import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import AuthModal from "./components/Auth/AuthModal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import OpportunityListing from './components/OpportunityListing';
import NgoDashboard from "./pages/NgoDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import ProfileEdit from "./components/ProfileEdit";
import MyApplications from "./pages/MyApplications";
import useAuth from "./context/useAuth";

const AppContent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [role, setRole] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const setUserRole = () => {
      if (user?.role) {
        setRole(user.role);
      }
    }
    setUserRole();
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

        <Route path="/opportunities" element={<OpportunityListing />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
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
          path="/opportunities/create"
          element={
            <ProtectedRoute>
              <CreateOpportunity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/opportunities/edit/:id"
          element={
            <ProtectedRoute>
              <EditOpportunity />
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
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
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