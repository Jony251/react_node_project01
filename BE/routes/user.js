const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dbSingleton = require('../database/dbSingleton');

// Get database connection
const db = dbSingleton.getConnection();

// Signup endpoint
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        // Validate username (only letters, at least 2 characters)
        if (!/^[a-zA-Z]{2,}$/.test(username)) {
            return res.status(400).json({
                error: 'Username must contain only letters and at least 2 letters'
            });
        }

        // Validate email
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Validate password (3-8 characters, alphanumeric, at least one number and one letter)
        if (!/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{3,8}$/.test(password)) {
            return res.status(400).json({
                error: 'Password must be 3-8 characters long, contain at least one number and one letter'
            });
        }

        // Check if user exists
        const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({
                    error: 'An error occurred while checking user existence'
                });
            }

            if (results.length > 0) {
                const existingUser = results[0];
                if (existingUser.username === username) {
                    return res.status(409).json({
                        error: 'Username already exists'
                    });
                } else {
                    return res.status(409).json({
                        error: 'Email already exists'
                    });
                }
            }

            try {
                // Hash the password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Insert new user
                const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
                db.query(insertQuery, [username, email, hashedPassword], (error, results) => {
                    if (error) {
                        console.error('Database error:', error);
                        return res.status(500).json({
                            error: 'An error occurred while creating the user'
                        });
                    }

                    res.status(201).json({
                        message: 'User registered successfully',
                        userId: results.insertId
                    });
                });
            } catch (hashError) {
                console.error('Password hashing error:', hashError);
                return res.status(500).json({
                    error: 'An error occurred while processing your password'
                });
            }
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).json({ error: err.message });
                return;
            }

            if (results.length === 0) {
                res.status(401).json({ message: 'User not found' });
                return;
            }

            const user = results[0];
            const isValid = await bcrypt.compare(password, user.password);

            if (!isValid) {
                res.status(401).json({ message: 'Invalid password' });
                return;
            }

            // Create user object without sensitive information
            const userResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role // Include the role in the response
            };

            console.log('User data being sent:', userResponse); // Debug log

            res.json({
                message: 'Login successful',
                user: userResponse,
                token: 'your-token-here' // Replace with actual token generation
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
});

// Get user by id endpoint
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, username, email FROM users WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(results[0]);
    });
});

// Get all users endpoint
router.get('/', (req, res) => {
    const query = 'SELECT id, username, email FROM users';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Update user endpoint
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Input validation
        if (!username || !email) {
            return res.status(400).json({
                error: 'Username and email are required'
            });
        }

        // Validate username (only letters, at least 2 characters)
        if (!/^[a-zA-Z]{2,}$/.test(username)) {
            return res.status(400).json({
                error: 'Username must contain only letters and at least 2 letters'
            });
        }

        // Validate email
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        let query;
        let params;

        if (password) {
            // Validate password (3-8 characters, alphanumeric, at least one number and one letter)
            if (!/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{3,8}$/.test(password)) {
                return res.status(400).json({
                    error: 'Password must be 3-8 characters long, contain at least one number and one letter'
                });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
            params = [username, email, hashedPassword, id];
        } else {
            query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
            params = [username, email, id];
        }

        db.query(query, params, (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({ message: 'User updated successfully' });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
});

// Delete user endpoint
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Check if user exists endpoint
router.post('/check', async (req, res) => {
    const { username, email } = req.body;

    if (!username && !email) {
        return res.status(400).json({
            error: 'Either username or email must be provided'
        });
    }

    try {
        let query = 'SELECT username, email FROM users WHERE ';
        let params = [];

        if (username && email) {
            query += 'username = ? OR email = ?';
            params = [username, email];
        } else if (username) {
            query += 'username = ?';
            params = [username];
        } else {
            query += 'email = ?';
            params = [email];
        }

        db.query(query, params, (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({
                    error: 'An error occurred while checking user existence'
                });
            }

            const exists = {
                username: false,
                email: false
            };

            if (results.length > 0) {
                results.forEach(result => {
                    if (result.username === username) exists.username = true;
                    if (result.email === email) exists.email = true;
                });
            }

            res.json({
                exists,
                message: exists.username || exists.email ? 
                    'User already exists' : 
                    'Username and email are available'
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
});

module.exports = router;