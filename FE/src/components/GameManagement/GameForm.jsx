import React, { useRef, useState } from 'react';
import CustomButton from '../common/CustomButton/CustomButton';
import CustomInput from '../common/CustomInput/CustomInput';
import './GameForm.css';

/**
 * GameForm component - a form for creating or editing a game
 * @param {string} mode - either 'upload' or 'edit'
 * @param {object} gameData - the initial game data
 * @param {boolean} loading - whether the form is loading or not
 * @param {function} onSubmit - the submit handler
 * @param {function} onChange - the change handler for the form fields
 * @param {function} onImageChange - the change handler for the image field
 * @param {function} onCancel - the cancel handler
 */
const GameForm = ({ mode, gameData, loading, onSubmit, onChange, onImageChange, onCancel }) => {
    const fileInputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
            onImageChange(e);
        }
    };

    return (
        <form onSubmit={onSubmit} className="game-form">
            <CustomInput
                type="text"
                id="title"
                name="title"
                value={gameData.title}
                onChange={onChange}
                label="Game Title"
                placeholder="Enter game title"
                required
                disabled={loading}
            />

            <CustomInput
                type="number"
                id="ageRating"
                name="ageRating"
                value={gameData.ageRating || ''}
                onChange={onChange}
                label="Age Rating"
                placeholder="Enter age rating (e.g., 12)"
                required
                disabled={loading}
                min="0"
                max="18"
            />

            <div className="form-group">
                <label htmlFor="content">Description</label>
                <textarea
                    id="content"
                    name="content"
                    value={gameData.content}
                    onChange={onChange}
                    required
                    placeholder="Enter game description"
                    disabled={loading}
                />
            </div>

            <div className="form-group file-input-group">
                <label>
                    {mode === 'upload' ? 'Game Image' : 'Update Game Image (optional)'}
                    {mode === 'upload' && <span className="required-mark">*</span>}
                </label>
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        ref={fileInputRef}
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={loading}
                        required={mode === 'upload'}
                        style={{ display: 'none' }}
                    />
                    <CustomButton
                        type="button"
                        onClick={handleFileButtonClick}
                        disabled={loading}
                        className="file-select-button"
                    >
                        Choose Image
                    </CustomButton>
                    {selectedFileName && (
                        <span className="selected-file-name">
                            {selectedFileName}
                        </span>
                    )}
                </div>
            </div>

            <div className="form-actions">
                <CustomButton
                    type="submit"
                    disabled={loading}
                    className="primary-button"
                >
                    {loading ? 'Processing...' : mode === 'upload' ? 'Upload Game' : 'Update Game'}
                </CustomButton>
                <CustomButton
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </CustomButton>
            </div>
        </form>
    );
};

export default GameForm;
