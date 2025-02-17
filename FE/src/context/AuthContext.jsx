import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * The AuthProvider component wraps the App component and provides the auth context to its children
 * It checks if the user is already logged in when the page loads and sets the appropriate state
 * It also provides the login and logout functions to change the state
 * @param {ReactNode} children The children components that will receive the auth context
 * @returns {ReactElement} The AuthProvider component
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if user is logged in on page load
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setUser(userData);
                // Check if role is exactly 1 (admin)
                setIsAdmin(userData.role === 1);
                console.log('User role:', userData.role, 'isAdmin:', userData.role === 1);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                setUser(null);
                setIsAdmin(false);
            }
        }
    }, []);

    /**
     * Logs in the user
     * @param {Object} userData The user data returned by the server
     * @param {string} token The authentication token
     */
    const login = (userData, token) => {
        console.log('Login data:', userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        // Check if role is exactly 1 (admin)
        setIsAdmin(userData.role === 1);
        console.log('Setting admin status:', userData.role === 1);
    };

    /**
     * Logs out the user
     * Removes the token and user data from local storage and sets the appropriate state
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * A hook that returns the user authentication state and functions to manage it.
 * This hook must be used within an AuthProvider.
 * @returns {Object} An object with the following properties:
 *   - isAuthenticated: A boolean indicating whether the user is authenticated or not
 *   - user: The user data if the user is authenticated, null otherwise
 *   - isAdmin: A boolean indicating whether the user is an admin or not
 *   - login: A function to log in the user
 *   - logout: A function to log out the user
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
