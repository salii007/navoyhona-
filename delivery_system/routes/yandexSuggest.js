// routes/yandexSuggest.js
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const YANDEX_URL = 'https://suggest-maps.yandex.ru/v1/suggest';
const API_KEY = process.env.YANDEX_API_KEY;

router.get('/', async (req, res) => {
  try {
    const { text, lang = 'uz_UZ', results = 5, types = 'geo' } = req.query;

    const response = await axios.get(YANDEX_URL, {
      params: { apikey: API_KEY, text, lang, results, types }
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Yandex suggest xato:', err.message);
    res.status(500).json({ error: 'Yandex bilan bog‘lanishda xato' });
  }
});

export default router;
