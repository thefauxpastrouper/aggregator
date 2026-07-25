import express from 'express';
import cors from 'cors';
import { apiRouter } from './notifier/api';
import { startCronJob, runCrawler } from './crawler/cron';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://aggregator.thefauxpastrouper.xyz',
  'http://localhost:5173',
  'http://localhost:3000'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.thefauxpastrouper.xyz') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  
  // Start the cron job for daily updates
  startCronJob();
  
  // Run crawler immediately in background with error handling so it never crashes the API server
  console.log('Running crawler immediately in background...');
  runCrawler().catch(err => {
    console.error('Initial background crawler run failed:', err);
  });
});