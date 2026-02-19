import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, openAuthModal } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            openAuthModal("login");
        }
    }, [loading, isAuthenticated, openAuthModal]);

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
