# Automatizacion de backups de LuxArs

## Objetivo

El comando `npm run backup` genera un ZIP cifrado (`.zip.enc`) con el proyecto
y lo envia por correo electronico como archivo adjunto. Las credenciales SMTP
y la contraseña del archivo se leen desde variables de entorno y nunca se
guardan en el repositorio. Ademas, cada ejecucion deja una copia visible en
una carpeta local dentro de `backups/`.

## Como se agrego la funcionalidad

1. Se agregaron las dependencias `archiver` y `nodemailer` al
   `package.json`. `archiver` crea el ZIP y `nodemailer` entrega el correo
   mediante SMTP.
2. Se agrego el comando `backup`:

   ```bash
   npm run backup
   ```

3. Se creo `scripts/backup.js`. El script:
   - valida que existan las variables SMTP y el destinatario;
   - crea la carpeta `backups/` si no existe;
   - genera un ZIP temporal y lo cifra con AES-256-GCM;
   - elimina el ZIP temporal y conserva `luxars-backup-fecha.zip.enc`;
   - crea `backups/luxars-backup-fecha/` con los archivos visibles del backup;
   - excluye `.git`, `node_modules`, `backups` y archivos `.env`;
   - conserva el ZIP aunque el envio falle;
   - informa el error y termina con codigo distinto de cero si el correo no
     pudo enviarse.
4. Se agrego `.env.example` como plantilla de configuracion. Es necesario
   crear la configuracion real fuera del control de versiones.
5. Se agrego este documento para dejar reproducible la instalacion,
   configuracion, ejecucion y programacion del backup.

## Configuracion local

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` como referencia. No subas un archivo `.env` real:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Definir las variables en la terminal. En PowerShell:

   ```powershell
   $env:BACKUP_EMAIL_TO = "migueartun@gmail.com"
   $env:SMTP_HOST = "smtp.gmail.com"
   $env:SMTP_PORT = "465"
   $env:SMTP_SECURE = "true"
   $env:SMTP_USER = "cuenta@ejemplo.com"
   $env:SMTP_PASSWORD = "clave-de-aplicacion"
   $env:BACKUP_ARCHIVE_PASSWORD = "una-clave-segura-para-el-backup"
   ```

   Para Gmail se debe usar una clave de aplicacion, no la contraseña
   principal. El proveedor SMTP puede requerir activar previamente la
   autenticacion de dos factores.

4. Ejecutar el backup:

   ```bash
   npm run backup
   ```

5. Confirmar que el archivo `.zip.enc` aparezca en `backups/` y revisar la
   bandeja del destinatario. El script muestra en consola si la creacion y el
   envio fueron exitosos. Gmail no puede inspeccionar el contenido cifrado.
   La carpeta con el mismo nombre sin `.zip.enc` permite revisar localmente
   `assets`, `scripts`, `index.html` y los demas archivos incluidos.

La contraseña `BACKUP_ARCHIVE_PASSWORD` es distinta de `SMTP_PASSWORD`.
Consérvala en un gestor seguro: se necesita para recuperar el ZIP.

## Programar la ejecucion en Windows

El Programador de tareas debe ejecutar el comando desde el directorio del
proyecto y recibir las variables SMTP de forma segura. Una opcion simple es
crear un archivo local `run-backup.ps1` fuera del repositorio con las
variables y el comando:

```powershell
$env:BACKUP_EMAIL_TO = "migueartun@gmail.com"
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "465"
$env:SMTP_SECURE = "true"
$env:SMTP_USER = "cuenta@ejemplo.com"
$env:SMTP_PASSWORD = "clave-de-aplicacion"
$env:BACKUP_ARCHIVE_PASSWORD = "una-clave-segura-para-el-backup"
Set-Location "C:\ruta\a\LuxArs"
npm run backup
```

En el Programador de tareas:

1. Crear una tarea basica y elegir la frecuencia (diaria o semanal).
2. En **Accion**, elegir **Iniciar un programa**.
3. Usar `powershell.exe` como programa.
4. Agregar como argumento:
   `-NoProfile -ExecutionPolicy Bypass -File "C:\ruta\run-backup.ps1"`.
5. Ejecutar la tarea manualmente una vez y comprobar el ZIP y el correo.

No guardes `run-backup.ps1` dentro del repositorio si contiene credenciales.
Para un servidor Linux, se puede usar el mismo comando desde `cron`, con las
variables definidas en el entorno seguro del servicio.

## Solucion de problemas

- **Faltan variables de entorno:** revisar los nombres escritos en la
  terminal o en el Programador de tareas.
- **Error de autenticacion SMTP:** verificar host, puerto, usuario y clave de
  aplicacion.
- **El ZIP existe pero no llega:** revisar el firewall, el puerto SMTP y los
  registros del proveedor de correo.
- **El ZIP queda incompleto:** revisar espacio disponible y permisos de
  escritura en `backups/`.
