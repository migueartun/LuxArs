const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;

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
