import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '../../context/AuthContext';
import NavButton from '../common/NavButton/NavButton';

const logo = process.env.PUBLIC_URL + '/logo.jpg';

/**
 * The Header component renders the main header of the application with the logo and main navigation
 *
 * @returns {React.ReactElement} The header component
 */

function Header() {
    const { logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" />
                </div>
                
                <div className={styles.projectName}>
                    <h1>Interactive Platform</h1>
                </div>
                
                <nav className={styles.nav}>
                    <NavButton to="/" end>
                        Home
                    </NavButton>
                    

                    <NavButton to="/games">
                        Games
                    </NavButton>
                    
                    <NavButton to="/contact">
                        Contact
                    </NavButton>

                    {isAdmin && (
                        <>
                            <NavButton to="/manage-games">
                                Manage Games
                            </NavButton>
                        </>
                    )}
                    
                    <NavButton onClick={handleLogout}>
                        Logout
                    </NavButton>
                </nav>
            </div>
        </header>
    );
}

export default Header;
