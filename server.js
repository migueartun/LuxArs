const express = require('express');
const cron = require('node-cron');
const path = require('path');
const backup = require('./servicios/backup.js');

const app = express();
const port = Number(process.env.PORT) || 4000;

cron.schedule('0 0 0 * * *', async () => {
    console.log('Realizando backup diario de la base de datos');

    try {
        await backup.backupDatabase();
    } catch (error) {
        console.error(`El backup programado falló: ${error.message}`);
    }
});

app.use(express.json({ limit: '10kb' }));
app.use(express.static(__dirname));

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'luxars' });
});

app.post('/api/newsletter', (req, res) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            error: 'Ingresa un correo electrónico válido.'
        });
    }

    console.log(`Nueva suscripción a la newsletter: ${email}`);
    return res.status(201).json({
        message: 'Suscripción registrada correctamente.'
    });
});

app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }
    return next();
});

app.listen(port, () => {
    console.log(`LuxArs disponible en http://localhost:${port}`);
});
