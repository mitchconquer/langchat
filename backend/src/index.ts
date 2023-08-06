import express, { Request, Response } from 'express';
import FormData from 'form-data';
import fetch from 'node-fetch';
import 'dotenv/config';
import multer from 'multer';
import cors from 'cors';

import speak from './speak';

const app = express();

app.use(express.json());

app.use(cors());

app.post('/api/speak', speak);

app.post('/api/ask', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post(
  '/api/transcribe',
  multer().single('file'),
  async (req: Request, res: Response) => {
    if (!req.file?.buffer || !req.file?.originalname) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const form = new FormData();

    form.append('model', 'whisper-1');
    form.append('file', req.file.buffer, req.file.originalname);

    const fetchRes = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        body: form,
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
          ...form.getHeaders(),
        },
        method: 'POST',
      }
    );

    const data = await fetchRes.json();

    if (data.error) {
      return res.status(400).json(data);
    }

    return res.json(data);
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));
