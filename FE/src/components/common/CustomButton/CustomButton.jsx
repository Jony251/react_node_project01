import React from 'react';
import './CustomButton.css';

/**
 * CustomButton is a reusable component that renders a button with custom styles
 * It can be used in various parts of the application
 * 
 * @param {string} type - the type of button. Can be 'button', 'submit', 'reset'
 * @param {function} onClick - the function to be called when the button is clicked
 * @param {*} children - the text or JSX to be displayed inside the button
 * @param {string} className - any additional CSS classes to be applied to the button
 * @param {boolean} isFileInput - if true, the button will behave like a file input
 * @param {string} variant - the variant of the button. Can be 'default', 'primary', 'delete'
 * @param {boolean} confirmDelete - if true, the button will show a confirmation dialog on click
 */
const CustomButton = ({ 
    type = 'button',
    onClick,
    children,
    className = '',
    isFileInput = false,
    variant = 'default',
    confirmDelete = false,
}) => {
    const handleClick = (e) => {
        if (variant === 'delete' && confirmDelete) {
            if (window.confirm('Are you sure you want to delete this item?')) {
                onClick && onClick(e);
            }
        } else {
            onClick && onClick(e);
        }
    };

    const buttonClass = `custom-button ${className} ${isFileInput ? 'file-button' : ''} ${variant}`.trim();

    return (
        <button
            type={type}
            onClick={handleClick}
            className={buttonClass}
        >
            {children}
        </button>
    );
};

export default CustomButton;
