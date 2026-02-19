import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthModal from './components/Auth/AuthModal'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import UserProfile from './components/UserProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();

  return (
    <main className='bg-zinc-100 min-h-screen overflow-hidden'>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
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
  )
}

export default App
