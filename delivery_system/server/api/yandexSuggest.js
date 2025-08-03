// server/api/yandexSuggest.js
router.get('/api/yandex-suggest', async (req, res) => {
    const { text, lang = 'uz_UZ', results = 5 } = req.query;
    const response = await axios.get('https://suggest-maps.yandex.net/v1/suggest', {
      params: {
        apikey: process.env.YANDEX_SUGGEST_API_KEY,
        text,
        lang,
        results
      }
    });
    res.json(response.data);
  });
  