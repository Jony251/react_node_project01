import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameManagement.css';
import CustomButton from '../common/CustomButton/CustomButton';
import Modal from '../common/Modal/Modal';
import GameForm from './GameForm';

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

    const fetchExistingGames = async () => {
        try {
            const response = await axios.get('/api/games');
            setExistingGames(response.data);
        } catch (error) {
            console.error('Error fetching games:', error);
            showMessage('Error loading games');
        }
    };

    const showMessage = (message, type = 'error') => {
        setPopupMessage(message);
        setPopupType(type);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGameData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setGameData(prevState => ({
            ...prevState,
            image: file
        }));
    };

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setGameData({
            id: null,
            title: '',
            content: '',
            image: null
        });
    };

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
