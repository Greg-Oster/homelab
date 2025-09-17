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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
