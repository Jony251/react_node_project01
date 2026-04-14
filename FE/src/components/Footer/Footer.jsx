import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3>🎮 FunZone</h3>
          <p>Educational games for kids – learn math, letters, and logic while having fun!</p>
        </div>

        <div className={styles.col}>
          <h4>Subjects</h4>
          <ul>
            <li><Link to="/games?cat=math">🔢 Math</Link></li>
            <li><Link to="/games?cat=letters">🔤 Letters</Link></li>
            <li><Link to="/games?cat=logic">🧩 Logic</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Navigate</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/games">All Games</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© {new Date().getFullYear()} FunZone. All rights reserved.</p>
        <p className={styles.hearts}>Made with ❤️ for kids everywhere</p>
      </div>
    </footer>
  );
}

export default Footer;
