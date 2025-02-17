import React from 'react'
import styles from "./Footer.module.css"

/**
 * Footer component for the application
 * @returns {JSX.Element} Footer
 * @constructor
 */
function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>Copyright &copy; 2025 Evgeny Nemchenko & Leonid Shmiakin</p>
    </footer>
  )
}

export default Footer