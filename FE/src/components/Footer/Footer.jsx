import React from 'react'
import styles from "./Footer.module.css"

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>Copyright &copy; 2025 Evgeny Nemchenko & Leonid Shmiakin</p>
    </footer>
  )
}

export default Footer