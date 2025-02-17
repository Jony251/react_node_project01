import React from 'react';
import styles from './ErrorPopup.module.css';

/**
 * A modal popup that displays an error message
 * 
 * @param {string} message - The error message to display
 * @param {function} onClose - A function to call when the popup is closed
 */
function ErrorPopup({ message, onClose }) {
    if (!message) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <h3>Error</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.content}>
                    {message}
                </div>
            </div>
        </div>
    );
}

export default ErrorPopup;
