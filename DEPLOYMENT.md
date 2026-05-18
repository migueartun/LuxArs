# Guía de Despliegue - LuxArs Landing Page

## 🚀 Opciones de Despliegue

Esta guía cubre múltiples opciones para desplegar la Landing Page de LuxArs a producción.

---

## 1. DESPLIEGUE EN NETLIFY (Recomendado)

### Ventajas
- ✅ Free tier generoso
- ✅ Certificado SSL automático
- ✅ CDN global incluido
- ✅ Redirecciones simples
- ✅ Env variables seguras
- ✅ Deploy previews

### Pasos

#### 1.1 Opción A: Vía CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Autenticar
netlify login

# Desplegar a staging
netlify deploy --dir=landing

# Desplegar a producción
netlify deploy --prod --dir=landing
```

#### 1.2 Opción B: Vía GitHub (Recomendado)

```bash
# 1. Push a GitHub
git add landing/
git commit -m "feat: Add LuxArs landing page"
git push origin main

# 2. En Netlify Dashboard:
# - Conectar repositorio GitHub
# - Seleccionar rama main
# - Build command: (dejar vacío)
# - Publish directory: landing
# - Guardar

# 3. Desplegar
# Se despliega automáticamente en cada push a main
```

#### 1.3 Configurar netlify.toml

Crear archivo `landing/netlify.toml`:

```toml
[build]
publish = "."
command = ""

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "SAMEORIGIN"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
for = "/assets/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
for = "/"
[headers.values]
Cache-Control = "public, max-age=3600"

[context.production]
command = ""
environment = { ENVIRONMENT = "production" }

[context.deploy-preview]
command = ""
environment = { ENVIRONMENT = "preview" }
```

---

## 2. DESPLIEGUE EN VERCEL

### Ventajas
- ✅ Optimizado para Next.js (si lo usas después)
- ✅ Muy rápido
- ✅ Excellent analytics
- ✅ Edge functions

### Pasos

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

Alternativa con GitHub:
1. Conectar repo en vercel.com
2. Seleccionar rama main
3. Root directory: landing
4. Listo - se despliega automáticamente

---

## 3. DESPLIEGUE EN GITHUB PAGES

### Ventajas
- ✅ Completamente gratis
- ✅ Integrado con GitHub
- ✅ Dominio personalizado

### Pasos

```bash
# 1. Crear rama gh-pages
git checkout -b gh-pages

# 2. Copiar contenido de landing
cp -r landing/* .

# 3. Commit y push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. En GitHub Settings > Pages:
# - Source: Deploy from branch
# - Branch: gh-pages
# - Folder: / (root)
# - Save
```

Acceder en: `https://[usuario].github.io/[repo]/`

---

## 4. DESPLIEGUE EN SERVIDOR PROPIO

### Opción A: Servidor Apache

```bash
# 1. Conectar por SSH
ssh user@servidor.com

# 2. Navegar a directorio web
cd /var/www/html

# 3. Descargar archivos
git clone <repo> luxars
cd luxars/landing

# 4. Configurar Apache (.htaccess)
echo '<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>' > .htaccess

# 5. Configurar permisos
chmod 644 index.html
chmod 755 assets assets/css assets/js
```

### Opción B: Servidor Nginx

```bash
# Conectar y navegar
ssh user@servidor.com
cd /var/www/html

# Descargar archivos
git clone <repo> luxars

# Configurar Nginx en /etc/nginx/sites-available/luxars
server {
    listen 80;
    server_name luxars.com www.luxars.com;
    
    root /var/www/html/luxars/landing;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Headers de seguridad
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/luxars /etc/nginx/sites-enabled/

# Verificar config y reiniciar
sudo nginx -t
sudo systemctl restart nginx
```

### Opción C: Docker

Crear `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY landing/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Crear `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - ENVIRONMENT=production
```

Desplegar:

```bash
docker-compose up -d
```

---

## 5. CONFIGURACIÓN DE DOMINIO

### DNS - Registradores Comunes

#### Namecheap
1. Dashboard > Domain List > Manage
2. Advanced DNS
3. Agregar records según host:
   - **A Record**: Apunta a IP del servidor
   - **CNAME**: `www` → tu dominio principal

#### GoDaddy
1. My Products > DNS Manager
2. Add Record
3. Type: A, Name: @, Value: IP servidor

#### AWS Route 53
```bash
# Vía AWS CLI
aws route53 create-resource-record-set \
  --hosted-zone-id Z123 \
  --resource-record-set file://recordset.json
```

### Certificado SSL

#### Opción A: Netlify/Vercel (Automático)
- No requiere configuración
- HTTPS automático

#### Opción B: Let's Encrypt (Gratis)
```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot certonly --nginx -d luxars.com -d www.luxars.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### Opción C: CloudFlare
1. Cambiar nameservers a CloudFlare
2. Dashboard > SSL/TLS > Full
3. Certificado automático

---

## 6. OPTIMIZACIÓN POST-DESPLIEGUE

### 6.1 Cache Strategy

#### Cache Headers en Netlify

```toml
[[headers]]
for = "/"
[headers.values]
Cache-Control = "public, max-age=3600, s-maxage=86400"

[[headers]]
for = "/assets/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"
```

#### Cache Strategy en Nginx

```nginx
location / {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}

location ~* \.(js|css|png|jpg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 6.2 Compresión

#### GZIP en Nginx
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
gzip_level 6;
```

#### Brotli (Más eficiente)
```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript;
```

---

## 7. MONITOREO POST-DESPLIEGUE

### 7.1 Herramientas de Monitoreo

#### Uptime Robot (Gratis)
1. Crear nuevo monitor
2. URL: https://luxars.com
3. Intervalo: 5 minutos
4. Alertas por email

#### Google Search Console
```
1. Ir a search.google.com/search-console
2. Agregar propiedad: https://luxars.com
3. Verificar propiedad con DNS
4. Enviar sitemap.xml
5. Monitorear indexación
```

#### Google Analytics 4
```html
<!-- Agregar a index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 7.2 Performance Monitoring

#### Sentry (Error Tracking)
```javascript
// Agregar a script.js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: "production",
  tracesSampleRate: 0.1
});
```

#### New Relic (APM)
```html
<script type="text/javascript">
  NREUM||(NREUM={}),__nr_require=function(t)...
</script>
```

---

## 8. CONFIGURACIÓN DE REDIRECTS

### Redirects Comunes

```toml
# Netlify
[[redirects]]
from = "/blog"
to = "https://blog.luxars.com"
status = 301

[[redirects]]
from = "/old-page"
to = "/index.html#nueva-seccion"
status = 301

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

---

## 9. CHECKLIST PRE-DESPLIEGUE

- [ ] Minificar CSS y JS
- [ ] Optimizar imágenes
- [ ] Validar HTML (W3C)
- [ ] Test responsive en móvil real
- [ ] Lighthouse score > 90
- [ ] Links internos funcionan
- [ ] Formularios validan
- [ ] Analytics configurado
- [ ] Error handling testeado
- [ ] Performance metrics revisadas
- [ ] Security headers configurados
- [ ] Sitemap.xml existe
- [ ] robots.txt configurado
- [ ] Meta tags completos

---

## 10. DESPLIEGUE AUTOMATIZADO CON GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './landing'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 11. ROLLBACK PLAN

Si algo sale mal en producción:

### Netlify
```bash
# Ver deploy history
netlify deploy:list

# Rollback a deploy anterior
netlify deploy:list --state published
# Seleccionar versión anterior y hacer "Publish" manualmente
```

### GitHub Pages
```bash
git revert HEAD  # Revertir último commit
git push origin gh-pages
```

### Servidor Propio
```bash
# Restore from backup
cd /var/www/html
rm -rf luxars
git clone <repo> luxars
cd luxars && git checkout <hash-anterior>
```

---

## 12. CONTACTO Y SOPORTE

- **Documentación**: [README.md](README.md)
- **SEO Guide**: [SEO-GUIDE.md](SEO-GUIDE.md)
- **Test Cases**: [QA-TEST-CASES.md](QA-TEST-CASES.md)
- **Email Support**: support@luxars.com

---

**Actualizado:** 2026-05-18
**Versión:** 1.0
**Maintainer:** LuxArs Development Team

