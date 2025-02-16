import React from 'react';
import './CustomInput.css';

const CustomInput = ({
    type = 'text',
    id,
    name,
    value,
    onChange,
    label,
    placeholder,
    error,
    className = '',
    required = false,
}) => {
    const inputClass = `custom-input ${error ? 'error' : ''} ${className}`.trim();

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                    {required && <span className="required-mark">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={inputClass}
                placeholder={placeholder}
                required={required}
            />
            {error && <span className="error-text">{error}</span>}
        </div>
    );
};

export default CustomInput;
