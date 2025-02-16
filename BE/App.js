const cors = require('cors');
const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database/dbSingleton');
const gamesRoutes = require('./routes/games');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/api/games', gamesRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = 8081; // Match the port in frontend proxy
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));