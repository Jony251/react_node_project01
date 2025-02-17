import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameManagement.css';
import CustomButton from '../common/CustomButton/CustomButton';
import Modal from '../common/Modal/Modal';
import GameForm from './GameForm';

/**
 * GameManagement component - handles game management features
 * 
 * This component fetches all existing games and renders them in a list
 * It also renders a button for creating new games
 * When a game is clicked, the component renders a modal with the game details
 * and a button to delete the game
 * When the create new game button is clicked, the component renders a modal with a form
 * to create a new game
 * 
 * State:
 * - existingGames: an array of game objects
 * - gameData: an object with the game data (id, title, content, image)
 * - loading: a boolean indicating if the component is loading
 * - showPopup: a boolean indicating if a popup should be shown
 * - popupMessage: the message to display in the popup
 * - popupType: the type of the popup (error or success)
 * - isModalOpen: a boolean indicating if the modal should be shown
 * 
 * Functions:
 * - fetchExistingGames: fetches all existing games and sets the state
 * - showMessage: shows a popup with a message
 * - handleDelete: deletes a game and fetches the existing games again
 * - handleSubmit: handles form submission and creates a new game
 * - handleInputChange: handles changes in the form input fields
 * - handleImageChange: handles changes in the form image field
 * - handleNewGame: handles the button click to create a new game
 * - handleCloseModal: handles the modal close button click
 * 
 * @returns {JSX.Element}
 */
const GameManagement = () => {
    const [mode, setMode] = useState('upload');
    const [gameData, setGameData] = useState({
        id: null,
        title: '',
        content: '',
        image: null,
    });
    const [existingGames, setExistingGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchExistingGames();
    }, []);

    /**
     * Fetches all existing games from the server and stores them in the
     * component state.
     */
    const fetchExistingGames = async () => {
        try {
            const response = await axios.get('/api/games');
            setExistingGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
            showMessage('Error loading games');
        }
    };


    /**
     * Shows a popup with a message.
     * @param {string} message the message to display
     * @param {string} type the type of the popup (error or success)
     */
    const showMessage = (message, type = 'error') => {
        setPopupMessage(message);
        setPopupType(type);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    /**
     * Handles the change event for the input fields in the game form.
     * Updates the game data state with the new value.
     * @param {Object} e the event object
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    /**
     * Handles the change event for the image input field in the game form.
     * Updates the game data state with the new image file.
     * @param {Object} e the event object
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setGameData(prevState => ({
            ...prevState,
            image: file
        }));
    };

    /**
     * Loads the game data from the server and updates the component state.
     * @param {number} gameId the id of the game to load
     */
    const loadGameData = async (gameId) => {
        try {
            const response = await axios.get(`/api/games/${gameId}`);
            const game = response.data;
            setGameData({
                id: game.id,
                title: game.title,
                content: game.content,
                image: null
            });
            setMode('edit');
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error loading game details:', error);
            showMessage('Error loading game details');
        }
    };

    /**
     * Handles the button click to create a new game.
     * Resets the game data and form mode, and opens the modal.
     */
    const handleNewGame = () => {
        setMode('upload');
        setGameData({
            id: null,
            title: '',
            content: '',
            image: null
        });
        setIsModalOpen(true);
    };

    /**
     * Closes the modal.
     * Resets the game data and form mode.
     */
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setGameData({
            id: null,
            title: '',
            content: '',
            image: null
        });
    };

    /**
     * Handles the form submission.
     * @param {Event} e - the event object
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', gameData.title);
            formData.append('content', gameData.content);
            if (gameData.image) {
                formData.append('image', gameData.image);
            }

            if (mode === 'upload') {
                await axios.post('/api/games', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showMessage('Game successfully uploaded!', 'success');
            } else {
                await axios.put(`/api/games/${gameData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showMessage('Game updated successfully!', 'success');
            }

            fetchExistingGames();
            handleCloseModal();
        } catch (error) {
            console.error('Operation error:', error);
            showMessage(error.response?.data?.message || `Error ${mode === 'upload' ? 'uploading' : 'updating'} game`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Deletes a game from the server.
     * @param {number} gameId the id of the game to delete
     */
    const handleDelete = async (gameId) => {
        if (!window.confirm('Are you sure you want to delete this game?')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`/api/games/${gameId}`);
            showMessage('Game deleted successfully!', 'success');
            fetchExistingGames();
            if (gameData.id === gameId) {
                handleCloseModal();
            }
        } catch (error) {
            console.error('Delete error:', error);
            showMessage(error.response?.data?.message || 'Error deleting game');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="game-management-container">
            <h2>Game Management</h2>
            {showPopup && (
                <div className={`popup ${popupType}`}>
                    {popupMessage}
                </div>
            )}

            <div className="mode-selector">
                <CustomButton 
                    onClick={handleNewGame}
                    disabled={loading}
                >
                    Add New Game
                </CustomButton>
            </div>

            <div className="games-grid">
                {existingGames.map(game => (
                    <div key={game.id} className="game-card">
                        <img 
                            src={`data:image/jpeg;base64,${game.image}`} 
                            alt={game.title} 
                            className="game-thumbnail" 
                        />
                        <h4>{game.title}</h4>
                        <div className="game-card-actions">
                            <CustomButton
                                onClick={() => loadGameData(game.id)}
                                disabled={loading}
                            >
                                Edit
                            </CustomButton>
                            <CustomButton
                                onClick={() => handleDelete(game.id)}
                                disabled={loading}
                                className="delete-button"
                            >
                                Delete
                            </CustomButton>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={mode === 'upload' ? 'Add New Game' : 'Edit Game'}
            >
                <GameForm
                    mode={mode}
                    gameData={gameData}
                    loading={loading}
                    onSubmit={handleSubmit}
                    onChange={handleInputChange}
                    onImageChange={handleImageChange}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default GameManagement;
