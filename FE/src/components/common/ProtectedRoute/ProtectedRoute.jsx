import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

/**
 * This component will redirect the user to the login page if the user is not authenticated
 * If the user is authenticated, it will render the children components
 * If the user is authenticated but the page requires admin role and the user is not an admin,
 * it will redirect to the main page
 * @param {ReactNode} children The components to render if the user is authenticated
 * @param {boolean} requireAuth Whether the page requires authentication or not
 * @param {boolean} requireAdmin Whether the page requires admin role or not
 * @returns The rendered component
 */
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
