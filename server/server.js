import express from "express";
import fetch from "node-fetch"; // или встроенный fetch в Node 20+
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache({ stdTTL: 60 * 5 }); // кэш на 5 минут

app.get("/api/vacancies", async (req, res) => {
    const { query, page = 0 } = req.query;

    const cacheKey = `${query}_${page}`;
    const cached = cache.get(cacheKey);

    if (cached) {
        return res.json(cached); // возвращаем из кэша
    }

    try {
        const response = await fetch(`https://api.hh.ru/vacancies?text=${query}&page=${page}`);
        if (!response.ok) throw new Error(`HH API error: ${response.status}`);

        const data = await response.json();

        cache.set(cacheKey, data); // сохраняем в кэш
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("!Server running on port 3000"));
