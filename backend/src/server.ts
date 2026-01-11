import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.route';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
