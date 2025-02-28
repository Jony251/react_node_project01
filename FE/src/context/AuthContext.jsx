import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
        if (token) {
            // Set up axios interceptor for adding token to requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                setIsAuthenticated(true);
                setUser(userData);
                setIsAdmin(userData.role === 1);
            } catch (error) {
                console.error('Error parsing user data:', error);
                handleLogout();
            }
        }
    }, []);

    /**
     * Logs in the user
     * @param {string} email The email of the user
     * @param {string} password The password of the user
     * @returns {Object} An object with a success property and a message property if the login fails
     */
    const handleLogin = async (email, password) => {
        try {
            const response = await axios.post('/api/user/login', {
                email,
                password
            });

            const { token, user } = response.data;
            
            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set up axios interceptor
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setIsAuthenticated(true);
            setUser(user);
            setIsAdmin(user.role === 1);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.error || 'Login failed'
            };
        }
    };

    /**
     * Logs out the user
     * Removes the token and user data from local storage and sets the appropriate state
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            isAdmin,
            login: handleLogin,
            logout: handleLogout
        }}>
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

export default AuthContext;
