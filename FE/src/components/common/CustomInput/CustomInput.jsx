import React from 'react';
import './CustomInput.css';

/**
 * CustomInput component
 * 
 * @param {string} type - the type of input element. Can be 'text', 'password', 'email', etc.
 * @param {string} id - the id of the input element
 * @param {string} name - the name of the input element
 * @param {string} value - the value of the input element
 * @param {function} onChange - the function to be called when the value of the input element changes
 * @param {string} label - the label to be displayed next to the input element
 * @param {string} placeholder - the placeholder text to be displayed in the input element
 * @param {boolean} error - if true, the input element will be styled as an error
 * @param {string} className - any additional CSS classes to be applied to the input element
 * @param {boolean} required - if true, the input element will be required
 */
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
