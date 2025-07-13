// routes/suggest.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/proxy-suggest', async (req, res) => {
  try {
    const { text, lang = 'uz_UZ', results = 5, type = 'geo' } = req.query;
    const apiRes = await axios.get('https://suggest-maps.yandex.ru/v1/suggest', {
      params: {
        apikey: process.env.YANDEX_SUGGEST_KEY,
        text,
        lang,
        results,
        type,
      },
    });
    res.json(apiRes.data);
  } catch (err) {
    console.error('Suggest proxy error:', err);
    res.status(500).json({ error: 'Suggest proxy xato' });
  }
});

export default router;
