const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');

require('dotenv').config();

const execFileAsync = promisify(execFile);
const dbName = process.env.MONGODB_DB || 'sample_mflix';
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
const outputPath = path.resolve(__dirname, '..', 'backup');

function resolveMongodumpPath() {
    const candidates = [
        process.env.MONGODUMP_PATH,
        'C:\\Program Files\\MongoDB\\Tools\\100\\bin\\mongodump.exe',
        'mongodump'
    ].filter(Boolean);

    const executable = candidates.find((candidate) => candidate === 'mongodump' || fs.existsSync(candidate));
    if (!executable) {
        throw new Error(
            'No se encontró mongodump. Instala MongoDB Database Tools o configura MONGODUMP_PATH en .env'
        );
    }

    return executable;
}

async function backupDatabase() {
    if (!mongoUri) {
        throw new Error('Falta MONGO_URI o MONGODB_URI en el archivo .env');
    }

    const args = [
        '--uri',
        mongoUri,
        '--db',
        dbName,
        '--out',
        outputPath,
        '--gzip'
    ];

    try {
        const { stdout, stderr } = await execFileAsync(resolveMongodumpPath(), args, {
            windowsHide: true,
            maxBuffer: 10 * 1024 * 1024
        });

        if (stdout.trim()) {
            console.log(`Respaldo completado con éxito: ${stdout.trim()}`);
        } else {
            console.log(`Respaldo completado con éxito en ${outputPath}`);
        }

        if (stderr.trim()) {
            console.warn(`Aviso de mongodump: ${stderr.trim()}`);
        }

        return outputPath;
    } catch (error) {
        const detail = error.stderr || error.message;
        console.error(`Error en el respaldo de MongoDB: ${detail.trim()}`);
        throw error;
    }
}

if (require.main === module) {
    backupDatabase().catch(() => {
        process.exitCode = 1;
    });
}

module.exports = { backupDatabase };
