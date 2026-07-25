import express from 'express';
import cors from 'cors';
import { apiRouter } from './notifier/api';
import { startCronJob, runCrawler } from './crawler/cron';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['https://aggregator.thefauxpastrouper.xyz', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api', apiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  
  // Start the cron job for daily updates
  startCronJob();
  
  // Run crawler immediately for testing as requested
  console.log('Running crawler immediately for testing...');
  runCrawler();
});