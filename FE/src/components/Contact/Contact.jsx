import React, { useState } from 'react';
import styles from './Contacts.module.css';
import CustomButton from '../common/CustomButton/CustomButton';

/**
 * A functional component that renders a form for sending a message to the
 * website author. The form includes fields for the user's name, email, and
 * message. When the form is submitted, it will alert the user with a message
 * confirming that the message was sent.
 *
 * @returns {React.ReactElement} The JSX element.
 */
function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

/**
 * Updates the formData state with the new value from the input field.
 * This function is triggered on input field change and dynamically updates
 * the corresponding field in the formData state object based on the input's name attribute.
 * 
 * @param {Object} e - The event object from the input field.
 */

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handles the form submission event. Prevents the default form submission behavior,
     * displays an alert box with the user's input values, and resets the form data to
     * an empty object.
     * 
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Message Sent!\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`);
        setFormData({ name: '', email: '', message: '' }); // Сброс формы
    };

    return (
        <section className={styles.contactUs}>
            <div className={styles.container}>
                <h1 className={styles.title}>Contact Us</h1>
                <form className={styles.contactForm} onSubmit={handleSubmit}>
                    <label htmlFor="name" className={styles.label}>
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />

                    <label htmlFor="email" className={styles.label}>
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label htmlFor="message" className={styles.label}>
                        Message:
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        className={styles.textarea}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                        rows="5"
                        required
                    ></textarea>

                    <CustomButton
                        type="submit"
                        variant="primary"
                        className="primary"
                    >
                        Send Message
                    </CustomButton>
                </form>
            </div>
        </section>
    );
}

export default ContactUs;
