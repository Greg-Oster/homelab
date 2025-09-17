const express = require('express');
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const path = require('path');

const app = express();
const PORT = 3000;


// Раздаём фронтенд
app.use(express.static(path.join(__dirname, 'public')));


// Проверка статуса Nginx
app.get('/status', async (req, res) => {
    try {
        const container = docker.getContainer('nginx');
        const data = await container.inspect();
        res.json({ status: data.State.Status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Перезапуск Nginx
app.post('/restart', async (req, res) => {
    try {
        const container = docker.getContainer('nginx');
        await container.restart();
        res.json({ message: 'Nginx перезапущен' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение логов Nginx
app.get('/logs', async (req, res) => {
    try {
        const container = docker.getContainer('nginx');
        const logs = await container.logs({ stdout: true, stderr: true, tail: 100 });
        res.send(logs.toString());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
