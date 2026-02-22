import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AuthProvider from "./context/AuthProvider";
import AuthModal from "./components/Auth/AuthModal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <main className="bg-zinc-100 min-h-screen overflow-hidden">
      <Navbar openAuthModal={openAuthModal} />

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
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
