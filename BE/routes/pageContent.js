const express = require('express');
const router = express.Router();
const dbSingleton = require('../database/dbSingleton');

// Get content by section
router.get('/:section', async (req, res) => {
    try {
        const connection = dbSingleton.getConnection();
        const [rows] = await connection.promise().query(
            'SELECT * FROM page_content WHERE section = ? AND active = TRUE',
            [req.params.section]
        );
        res.json(rows[0] || { content: '' });
    } catch (error) {
        console.error('Error fetching page content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update content
router.put('/:section', async (req, res) => {
    try {
        const connection = dbSingleton.getConnection();
        const { content } = req.body;
        
        // Check if content exists
        const [existing] = await connection.promise().query(
            'SELECT id FROM page_content WHERE section = ?',
            [req.params.section]
        );

        if (existing.length > 0) {
            // Update existing content
            await connection.promise().query(
                'UPDATE page_content SET content = ? WHERE section = ?',
                [content, req.params.section]
            );
        } else {
            // Insert new content
            await connection.promise().query(
                'INSERT INTO page_content (section, content) VALUES (?, ?)',
                [req.params.section, content]
            );
        }

        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error('Error updating page content:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
