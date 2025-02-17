import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavButton.css';

/**
 * A styled button component that can be used as a link to any other route in the application
 * 
 * @param {string} to - The route to link to
 * @param {function} onClick - A function to call when the button is clicked
 * @param {ReactNode} children - The content of the button
 * @param {boolean} end - Whether the button should be at the end of the navigation bar
 * @param {string} className - Additional CSS classes to apply to the button
 */
const NavButton = ({ 
    to, 
    onClick, 
    children, 
    end = false,
    className = '' 
}) => {
    if (to) {
        return (
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `nav-button ${isActive ? 'active' : ''} ${className}`.trim()
                }
                end={end}
            >
                {children}
            </NavLink>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`nav-button ${className}`.trim()}
            type="button"
        >
            {children}
        </button>
    );
};

export default NavButton;
