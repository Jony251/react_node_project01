import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (requireAuth && !isAuthenticated) {
        // User is not authenticated and page requires auth
        return <Navigate to="/login" replace />;
    }

    if (!requireAuth && isAuthenticated) {
        // User is authenticated and page requires no auth (like login page)
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && !isAdmin) {
        // User is not admin but page requires admin access
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
