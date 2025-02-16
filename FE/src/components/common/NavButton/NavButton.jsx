import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavButton.css';

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
