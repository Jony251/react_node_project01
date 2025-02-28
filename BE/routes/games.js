const express = require('express');
const router = express.Router();
const dbSingleton = require('../database/dbSingleton');
const db = dbSingleton.getConnection();
const multer = require('multer');

// Configure multer for image upload with validation
const storage = multer.memoryStorage();

// File filter function to validate image
const fileFilter = (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'), false);
    }

    // List of allowed image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid image type. Only JPEG, PNG, and GIF are allowed.'), false);
    }

    cb(null, true);
};

// Configure multer with size limits and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024, // 1MB limit
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 1MB.'
            });
        }
        return res.status(400).json({
            message: 'Error uploading file: ' + err.message
        });
    } else if (err) {
        return res.status(400).json({
            message: err.message
        });
    }
    next();
};

// Get all games
router.get('/', (req, res) => {
    const query = 'SELECT * FROM games'; // Now including image
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Convert image buffers to base64 strings
        const gamesWithBase64Images = results.map(game => ({
            ...game,
            image: game.image ? game.image.toString('base64') : null
        }));
        res.json(gamesWithBase64Images);
    });
});

// Get a specific game by ID (including image)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM games WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }

        const game = results[0];
        // Convert image buffer to base64 string if image exists
        if (game.image) {
            game.image = game.image.toString('base64');
        }
        res.json(game);
    });
});

// Create a new game with validation
router.post('/', upload.single('image'), handleMulterError, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const { title, content, ageRating } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Insert into games table
        const query = 'INSERT INTO games (title, image, content, ageRating) VALUES (?, ?, ?, ?)';
        
        db.query(query, [title, req.file.buffer, content, ageRating], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    message: 'Error saving game to database',
                    error: err.message 
                });
            }

            res.status(201).json({
                message: 'Game uploaded successfully',
                gameId: results.insertId,
                title: title
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            message: 'Error processing upload',
            error: error.message 
        });
    }
});

// Update a game with validation
router.put('/:id', upload.single('image'), handleMulterError, (req, res) => {
    const { id } = req.params;
    const { title, content, ageRating } = req.body;
    
    let query;
    let params;

    if (req.file) {
        // If new image is provided, update all fields
        query = 'UPDATE games SET title = ?, image = ?, content = ?, ageRating = ? WHERE id = ?';
        params = [title, req.file.buffer, content, ageRating, id];
    } else {
        // If no new image, only update title and content
        query = 'UPDATE games SET title = ?, content = ?, ageRating = ? WHERE id = ?';
        params = [title, content, ageRating, id];
    }
    
    db.query(query, params, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }
        
        res.json({ message: 'Game updated successfully' });
    });
});

// Delete a game
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM games WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }
        
        res.json({ message: 'Game deleted successfully' });
    });
});

// Get game image by ID
router.get('/:id/image', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT image FROM games WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(results[0].image);
    });
});

module.exports = router;
