import express from "express";
import fetch from "node-fetch"; // или встроенный fetch в Node 20+
import NodeCache from "node-cache";
import cors from "cors";
import sqlite3 from "sqlite3";


const app = express();
app.use(express.json());
const cache = new NodeCache({ stdTTL: 60 * 5 }); // кэш на 5 минут


const db = new sqlite3.Database('./mydb.sqlite');

// создаём таблицу (если её нет)
db.prepare(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    date TEXT,
    description TEXT
  )
`).run();


app.use(cors({
    origin: "*",
    credentials: true,
}));

// добавить запись
app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    db.run(
        `INSERT INTO notes (title, content) VALUES (?, ?)`,
        [title, content],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, content });
        }
    );
});

// редактировать запись
app.put("/notes/:id", (req, res) => {
    const { id } = req.params;
    const { title, subtitle, date, description } = req.body;

    console.log('Updated notes for %d title %d', title);

    try {
        const stmt = db.prepare(`
          UPDATE notes
          SET title = COALESCE(?, title),
              subtitle = COALESCE(?, subtitle),
              date = COALESCE(?, date),
              description = COALESCE(?, description)
          WHERE id = ?
        `);

        const result = stmt.run(title, subtitle, date, description, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Запись не найдена" });
        }

        res.json({ message: "Запись обновлена" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка при обновлении записи" });
    }
});

// получить все записи
app.get('/notes', (req, res) => {
    db.all(`SELECT * FROM notes`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


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
