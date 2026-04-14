require('dotenv').config();

const cors    = require('cors');
const express = require('express');
const gamesRoutes   = require('./routes/games');
const userRoutes    = require('./routes/user');
const authRoutes    = require('./routes/auth');
const pageContentRouter = require('./routes/pageContent');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth',         authRoutes);
app.use('/api/games',        gamesRoutes);
app.use('/api/user',         userRoutes);
app.use('/api/page-content', pageContentRouter);

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
