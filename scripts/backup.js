const fs = require('node:fs');
const crypto = require('node:crypto');
const dns = require('node:dns');
const path = require('node:path');
const archiver = require('archiver');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const projectRoot = path.resolve(__dirname, '..');
const backupDirectory = path.join(projectRoot, 'backups');
const defaultBackupRecipient = 'migueartun@gmail.com';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const zipName = `luxars-backup-${timestamp}.zip`;
const zipPath = path.join(backupDirectory, zipName);
const archiveName = `${zipName}.enc`;
const archivePath = path.join(backupDirectory, archiveName);
const snapshotDirectory = path.join(backupDirectory, `luxars-backup-${timestamp}`);
const backupRecipient = process.env.BACKUP_EMAIL_TO || defaultBackupRecipient;
const maxAttachmentBytes = Number(process.env.BACKUP_MAX_ATTACHMENT_MB || 18) * 1024 * 1024;

const requiredEnvironment = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'BACKUP_ARCHIVE_PASSWORD',
    'MONGODB_URI'
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
        '.git',
        'node_modules',
        'backups',
        'backup',
        '.env',
        '.env.local'
    ].some((excludedPath) => normalizedPath === excludedPath || normalizedPath.startsWith(`${excludedPath}/`));
}

function createVisibleSnapshot() {
    function copyDirectory(sourceDirectory, targetDirectory) {
        fs.mkdirSync(targetDirectory, { recursive: true });

        for (const entry of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
            const sourcePath = path.join(sourceDirectory, entry.name);
            const targetPath = path.join(targetDirectory, entry.name);
            const relativePath = path.relative(projectRoot, sourcePath);

            if (!shouldInclude(relativePath)) {
                continue;
            }

            if (entry.isDirectory()) {
                copyDirectory(sourcePath, targetPath);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        }
    }

    copyDirectory(projectRoot, snapshotDirectory);
}

async function createMongoBackup() {
    const client = new MongoClient(process.env.MONGODB_URI);
    const databaseDirectory = path.join(snapshotDirectory, 'database');

    try {
        await client.connect();
        const database = client.db(process.env.MONGODB_DB || undefined);
        const collections = await database.listCollections().toArray();
        fs.mkdirSync(databaseDirectory, { recursive: true });

        for (const collectionInfo of collections) {
            const fileName = `${collectionInfo.name.replace(/[^a-zA-Z0-9._-]/g, '_')}.json`;
            const output = fs.createWriteStream(path.join(databaseDirectory, fileName));
            let isFirstDocument = true;

            output.write('[\n');
            for await (const document of database.collection(collectionInfo.name).find({})) {
                if (!isFirstDocument) {
                    output.write(',\n');
                }
                isFirstDocument = false;
                output.write(`  ${JSON.stringify(document)}`);
            }
            output.write('\n]\n');
            await new Promise((resolve, reject) => {
                output.on('finish', resolve);
                output.on('error', reject);
                output.end();
            });
        }

        fs.writeFileSync(
            path.join(databaseDirectory, 'manifest.json'),
            JSON.stringify({
                database: database.databaseName,
                generatedAt: new Date().toISOString(),
                collections: collections.map((collection) => collection.name)
            }, null, 2)
        );
    } finally {
        await client.close();
    }
}

function createArchive() {
    return new Promise((resolve, reject) => {
        fs.mkdirSync(backupDirectory, { recursive: true });

        const output = fs.createWriteStream(zipPath);
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
        archive.directory(snapshotDirectory, false);
        archive.finalize();
    });
}

function encryptArchive() {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);
    const key = crypto.scryptSync(process.env.BACKUP_ARCHIVE_PASSWORD, salt, 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(fs.readFileSync(zipPath)), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const payload = Buffer.concat([
        Buffer.from('LUXARS1'),
        salt,
        iv,
        authTag,
        encrypted
    ]);

    fs.writeFileSync(archivePath, payload);
    fs.rmSync(zipPath);
}

function splitArchive() {
    const archiveSize = fs.statSync(archivePath).size;
    const partCount = Math.ceil(archiveSize / maxAttachmentBytes);

    if (partCount === 1) {
        return [{ path: archivePath, filename: archiveName }];
    }

    const archiveHandle = fs.openSync(archivePath, 'r');
    const parts = [];

    try {
        for (let partNumber = 0; partNumber < partCount; partNumber += 1) {
            const start = partNumber * maxAttachmentBytes;
            const length = Math.min(maxAttachmentBytes, archiveSize - start);
            const partName = `${archiveName}.part-${String(partNumber + 1).padStart(3, '0')}-of-${String(partCount).padStart(3, '0')}`;
            const partPath = path.join(backupDirectory, partName);
            const buffer = Buffer.alloc(length);

            fs.readSync(archiveHandle, buffer, 0, length, start);
            fs.writeFileSync(partPath, buffer);
            parts.push({ path: partPath, filename: partName });
        }
    } finally {
        fs.closeSync(archiveHandle);
    }

    return parts;
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

    const parts = splitArchive();

    for (let partNumber = 0; partNumber < parts.length; partNumber += 1) {
        const part = parts[partNumber];
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: backupRecipient,
            subject: `Backup de LuxArs (${partNumber + 1}/${parts.length}) - ${new Date().toLocaleDateString('es-CO')}`,
            text: parts.length === 1
                ? 'Se adjunta el backup cifrado de LuxArs.'
                : `Parte ${partNumber + 1} de ${parts.length}. Guarda todas las partes para reconstruir el archivo ${archiveName}.`,
            attachments: [part]
        });
    }

    return parts;
}

async function main() {
    validateEnvironment();
    createVisibleSnapshot();
    await createMongoBackup();
    await createArchive();
    encryptArchive();
    console.log(`Backup creado: ${archivePath}`);

    try {
        const sentParts = await sendArchiveByEmail();
        console.log(`Backup enviado a: ${backupRecipient} (${sentParts.length} correo(s))`);
    } catch (error) {
        console.error(`El backup fue creado, pero no se pudo enviar por correo: ${error.message}`);
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(`No se pudo generar el backup: ${error.message}`);
    process.exitCode = 1;
});
