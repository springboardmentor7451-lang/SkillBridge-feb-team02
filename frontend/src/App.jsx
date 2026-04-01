import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider";
import { SocketProvider } from "./context/SocketProvider";
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
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import useAuth from "./context/useAuth";
import OpportunityDetails from "./pages/OpportunityDetails";

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
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />

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
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
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
      <SocketProvider>
        <div className="flex flex-col min-h-screen">
          <AppContent />
        </div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;