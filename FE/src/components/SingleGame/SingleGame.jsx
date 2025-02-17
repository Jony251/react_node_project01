import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import styles from './SingleGame.module.css';
import CustomButton from '../common/CustomButton/CustomButton';
import axios from 'axios';

/**
 * SingleGame component - displays a single game
 * 
 * This component fetches a game based on the id in the URL
 * and renders its details
 * 
 * @returns {JSX.Element}
 */
function SingleGame() {
    const location = useLocation();
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchGameData();
        } else if (location.state?.post) {
            setGame(location.state.post);
            setLoading(false);
        }
    }, [id, location]);
    
    /**
     * Fetches a game based on the id in the URL
     * and sets the game state
     */
    const fetchGameData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`/api/games/${id}`);
            if (response.data) {
                // Convert base64 image data to URL
                const imageUrl = response.data.image 
                    ? `data:image/jpeg;base64,${response.data.image}`
                    : null;

                setGame({
                    ...response.data,
                    imageUrl: imageUrl
                });
            } else {
                setError('Game not found');
            }
        } catch (error) {
            console.error('Error loading game:', error);
            setError(error.response?.data?.message || 'Error loading game');
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <section className={styles.game}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.game}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Error</h2>
                        <p>{error}</p>
                        <CustomButton
                            variant="primary"
                            className="primary"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Back to Games
                        </CustomButton>
                    </div>
                </div>
            </section>
        );
    }

    if (!game) {
        return (
            <section className={styles.game}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>Game Not Found</h2>
                        <CustomButton
                            variant="primary"
                            className="primary"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Back to Games
                        </CustomButton>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.game}>
            <div className={styles.container}>
                <div className={styles.singleGame}>
                    <h1 className={styles.gameTitle}>{game.title}</h1>
                    {game.imageUrl && (
                        <div className={styles.imageContainer}>
                            <img 
                                src={game.imageUrl} 
                                alt={game.title} 
                                className={styles.gameImage} 
                            />
                        </div>
                    )}
                    <div className={styles.gameContent}>
                        {game.content}
                    </div>
                    <div className={styles.actions}>
                        <CustomButton
                            variant="primary"
                            className="primary"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Back to Games
                        </CustomButton>
                    </div>
                </div>
            </div>
        </section>        
    );
}

export default SingleGame;
