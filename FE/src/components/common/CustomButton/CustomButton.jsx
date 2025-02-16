import React from 'react';
import './CustomButton.css';

const CustomButton = ({ 
    type = 'button',
    onClick,
    children,
    className = '',
    isFileInput = false,
    variant = 'default', // can be 'default', 'primary', 'delete'
    confirmDelete = false, // if true, will show confirmation dialog for delete
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
