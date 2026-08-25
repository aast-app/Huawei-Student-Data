import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoutes.js';
import connectDB from './config/db.js';

// Load env vars (for local testing mostly, Vercel loads them automatically)
dotenv.config();

// Connect to Database
// Note: In serverless, we must handle connections carefully. 
// For now, this connects when the app boots up.
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/register', studentRoutes);

// Basic Route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running and connected!' });
});

export default app;
