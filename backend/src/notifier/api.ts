import express from 'express';
import { prisma } from './db';

export const apiRouter = express.Router();

apiRouter.get('/notices', async (req, res) => {
  const { university } = req.query;
  try {
    const whereClause = university ? { university: String(university) } : {};
    const notices = await prisma.notice.findMany({
      where: whereClause,
      orderBy: [
        { date: 'desc' },
        { id: 'asc' }
      ],
      take: 50,
    });
    res.json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});
