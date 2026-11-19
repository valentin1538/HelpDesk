import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ api: 'ok', db: mongoose.connection.readyState === 1 ? 'ok' : 'down' });
});

export default app;