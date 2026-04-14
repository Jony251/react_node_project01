import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logoArea} onClick={closeMenu}>
          <span className={styles.logoEmoji}>🎮</span>
          <span className={styles.logoText}>Fun<span>Zone</span></span>
        </NavLink>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            🏠 Home
          </NavLink>

          <NavLink
            to="/games"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            🎯 Games
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            ✉️ Contact
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/manage-games"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              onClick={closeMenu}
            >
              ⚙️ Manage
            </NavLink>
          )}

          <button className={styles.logoutBtn} onClick={handleLogout}>
            👋 Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
