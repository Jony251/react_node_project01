import React, { useState } from 'react';
import styles from './Contacts.module.css';
import CustomInput from '../common/CustomInput/CustomInput';

function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className={styles.contactUs}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerEmoji}>✉️</div>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>Have a question or idea? We'd love to hear from you!</p>
        </div>

        {sent ? (
          <div className={styles.successMsg}>🎉 Message sent! We'll get back to you soon.</div>
        ) : (
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <label htmlFor="name" className={styles.label}>Your Name</label>
            <CustomInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email" className={styles.label}>Email Address</label>
            <CustomInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              className={styles.textarea}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here…"
              rows={5}
              required
            />

            <button type="submit" className={styles.sendBtn}>
              🚀 Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactUs;
