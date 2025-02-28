import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './login.module.css';
import ErrorPopup from '../ErrorPopup/ErrorPopup';
import CustomButton from '../common/CustomButton/CustomButton';
import CustomInput from '../common/CustomInput/CustomInput';
import { useAuth } from '../../context/AuthContext';

/**
 * The Login component handles user login and signup.
 * It renders a form with inputs for username, email, password, and confirm password.
 * The form is validated using the validateForm() function.
 * If the form is valid, the handleSubmit() function is called.
 * The handleSubmit() function sends a POST request to the server with the form data.
 * If the response is ok, the user is logged in and redirected to the homepage.
 * If the response is not ok, an error message is displayed.
 * The component also renders a button to toggle between login and signup modes.
 * @returns The Login component
 */
function Login() {
    /**
     * A state variable to track whether the user is in login mode or signup mode.
     * @type {boolean}
     */
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    /**
     * A function to validate the form.
     * It checks for the presence and validity of the username, email, password, and confirm password fields.
     * If the form is valid, it returns true. Otherwise, it returns false and sets the errors state with the appropriate error messages.
     * @returns {boolean} Whether the form is valid or not.
     */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        if (!isLoginMode) {
            // Additional signup validations
            if (!formData.username) {
                newErrors.username = 'Username is required';
            } 
            else if (!/^[a-zA-Z]{2,}$/.test(formData.username)) {
                newErrors.username = 'Username must contain only letters and at least 2 letters';
            }

            if (!/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{3,8}$/.test(formData.password)) {
                newErrors.password = 'Password must consist of alphanumeric characters (letters and numbers) with a length of 3 to 8 characters inclusive, with at least one number and at least one letter';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } 
            else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Handles the change event for the input fields in the login form.
     * Updates the formData state with the new value.
     * @param {Object} e the event object
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }
    };

    /**
     * Handles the form submission event.
     * Prevents the default form submission behavior.
     * If the form is valid, it sends a POST request to the server to log in or sign up the user.
     * If the form is invalid, it displays the appropriate error messages.
     * @param {Object} e the event object
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            if (isLoginMode) {
                // Login logic
                const loginResult = await login(formData.email, formData.password);
                if (loginResult.success) {
                    navigate('/');
                } else {
                    setErrors({
                        submit: loginResult.message
                    });
                }
            } else {
                // Signup logic
                const response = await axios.post('/api/user/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                if (response.status === 201) {
                    setIsLoginMode(true);
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    });
                    setErrors({
                        submit: 'Registration successful! Please log in.'
                    });
                }
            }
        } catch (error) {
            console.error('Auth error:', error);
            setErrors({
                submit: error.response?.data?.error || error.message || `An error occurred during ${isLoginMode ? 'login' : 'registration'}`
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Closes the error popup
    const handleCloseError = () => {
        setErrors(prev => ({ ...prev, submit: '' }));
    };

    // Toggles the mode between login and registration
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.title}>{isLoginMode ? 'Login' : 'Sign Up'}</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {!isLoginMode && (
                        <CustomInput
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            label="Username"
                            placeholder="Enter your username"
                            error={errors.username}
                            required
                        />
                    )}

                    <CustomInput
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        label="Email"
                        placeholder="Enter your email"
                        error={errors.email}
                        required
                    />

                    <CustomInput
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        label="Password"
                        placeholder="Enter your password"
                        error={errors.password}
                        required
                    />

                    {!isLoginMode && (
                        <CustomInput
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            error={errors.confirmPassword}
                            required
                        />
                    )}

                    <CustomButton 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                        variant="primary"
                    >
                        {isLoading ? (isLoginMode ? 'Logging in...' : 'Signing up...') : (isLoginMode ? 'Login' : 'Sign Up')}
                    </CustomButton>

                    <div className={styles.togglePrompt}>
                        <span>{isLoginMode ? "Don't have an account?" : "Already have an account?"}</span>
                        <CustomButton
                            onClick={toggleMode}
                            className={styles.toggleLink}
                            variant="primary"
                        >
                            {isLoginMode ? 'Sign up' : 'Log in'}
                        </CustomButton>
                    </div>

                </form>
            </div>

            <ErrorPopup 
                message={errors.submit} 
                onClose={handleCloseError}
            />
        </div>
    );
}

export default Login;