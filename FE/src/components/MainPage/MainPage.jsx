import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css'; 
import axios from 'axios';

/**
 * MainPage component - displays a list of games with links.
 * @returns {JSX.Element}
 */
function MainPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGames();
    }, []);
    
    /**
     * Fetches all games from the server and updates the component state
     * Sets loading true while fetching and false when done
     * If there's an error, sets the error state
     */
    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/games');
            
            // Images are already in base64 format from backend
            const gamesWithImages = response.data.map(game => ({
                ...game,
                imageUrl: game.image ? `data:image/jpeg;base64,${game.image}` : null
            }));
            
            setGames(gamesWithImages);
        } catch (error) {
            console.error('Error fetching games:', error);
            setError('Failed to load games. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.mainPage}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading games...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.mainPage}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.mainPage}>
            <section>
                <div className={styles.container}>
                    <h1 className={styles.mainPageTitle}>Games</h1>
                    <div className={styles.gameContainer}>
                        {games.map((game) => (
                            <div key={game.id} className={styles.gameCard}>
                                {game.imageUrl && (
                                    <img 
                                        src={game.imageUrl} 
                                        alt={game.title} 
                                        className={styles.gameImage} 
                                    />
                                )}
                                <h2 className={styles.gameTitle}>{game.title}</h2>
                                <Link
                                    to={`/game/${game.id}`}
                                    state={{ post: game }}
                                    className={styles.viewButton}
                                >
                                    View
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MainPage;
