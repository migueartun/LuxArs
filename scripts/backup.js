const fs = require('node:fs');
const path = require('node:path');
const archiver = require('archiver');
require('dotenv').config();
const nodemailer = require('nodemailer');

const projectRoot = path.resolve(__dirname, '..');
const backupDirectory = path.join(projectRoot, 'backups');
const defaultBackupRecipient = 'migueartun@gmail.com';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const archiveName = `luxars-backup-${timestamp}.zip`;
const archivePath = path.join(backupDirectory, archiveName);
const backupRecipient = process.env.BACKUP_EMAIL_TO || defaultBackupRecipient;

const requiredEnvironment = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD'
];

function validateEnvironment() {
    const missing = requiredEnvironment.filter((name) => !process.env[name]);
    if (missing.length > 0) {
        throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
    }
}

function shouldInclude(entryPath) {
    const normalizedPath = entryPath.replace(/\\/g, '/');
    return ![
        '.git/',
        'node_modules/',
        'backups/',
        '.env',
        '.env.local'
    ].some((excludedPath) => normalizedPath === excludedPath || normalizedPath.startsWith(excludedPath));
}

function createArchive() {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(backupDirectory, { recursive: true });

        const output = fs.createWriteStream(archivePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', resolve);
        output.on('error', reject);
        archive.on('warning', (error) => {
            if (error.code === 'ENOENT') {
                console.warn(`Advertencia al crear backup: ${error.message}`);
                return;
            }
            reject(error);
        });
        archive.on('error', reject);

        archive.pipe(output);
        archive.directory(projectRoot, false, (entry) => shouldInclude(entry.name) ? entry : false);
        archive.finalize();
    });
}

async function sendArchiveByEmail() {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: backupRecipient,
        subject: `Backup de LuxArs - ${new Date().toLocaleDateString('es-CO')}`,
        text: 'Se adjunta el backup comprimido de LuxArs generado automáticamente.',
        attachments: [{ filename: archiveName, path: archivePath }]
    });
}

async function main() {
    validateEnvironment();
    await createArchive();
    console.log(`Backup creado: ${archivePath}`);

    try {
        await sendArchiveByEmail();
        console.log(`Backup enviado a: ${backupRecipient}`);
    } catch (error) {
        console.error(`El backup fue creado, pero no se pudo enviar por correo: ${error.message}`);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(`No se pudo generar el backup: ${error.message}`);
    process.exitCode = 1;
});
