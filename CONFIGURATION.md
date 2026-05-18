# Archivos de Configuración y Setup - LuxArs Landing

## Archivos de Configuración Recomendados

Este documento incluye templates para archivos de configuración que facilitan el desarrollo, testing y despliegue.

---

## 1. .gitignore

Crear `landing/.gitignore`:

```
# Dependencias
node_modules/
npm-debug.log
yarn-error.log

# Archivos IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Archivos compilados
dist/
build/
*.min.js
*.min.css

# Variables de entorno
.env
.env.local
.env.*.local

# Archivos de caché
.cache/
*.cache
.netlify/
.vercel/

# Sistema de archivos
Thumbs.db
.DS_Store

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log

# Temporales
tmp/
temp/
*.bak
```

---

## 2. .env.example

Crear `landing/.env.example`:

```
# Base URLs
REACT_APP_API_URL=https://api.luxars.com
REACT_APP_SITE_URL=https://luxars.com

# Analytics
REACT_APP_GA_ID=G-XXXXXXXXXX
REACT_APP_SENTRY_DSN=https://key@sentry.io/project

# Environment
NODE_ENV=production
REACT_APP_ENV=production

# Paging & Database
REACT_APP_DB_URL=https://db.example.com
REACT_APP_STORAGE_URL=https://storage.example.com
```

---

## 3. .editorconfig

Crear `landing/.editorconfig`:

```ini
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
trim_trailing_whitespace = true

# HTML files
[*.html]
indent_style = space
indent_size = 2

# CSS files
[*.css]
indent_style = space
indent_size = 2

# JavaScript files
[*.js]
indent_style = space
indent_size = 2

# JSON files
[*.json]
indent_style = space
indent_size = 2

# Markdown files
[*.md]
trim_trailing_whitespace = false
```

---

## 4. package.json (Para Scripts Útiles)

Crear `landing/package.json`:

```json
{
  "name": "luxars-landing",
  "version": "1.0.0",
  "description": "Landing page para LuxArs - Marketplace de fotografía profesional",
  "main": "index.html",
  "scripts": {
    "start": "python -m http.server 8000",
    "serve": "http-server -p 8000 -c-1",
    "build": "echo 'No build step needed for static site'",
    "validate": "html-validate index.html",
    "lighthouse": "lighthouse https://localhost:8000 --view",
    "test": "echo 'Run QA test cases manually'",
    "deploy": "netlify deploy --prod --dir=.",
    "preview": "netlify deploy --dir=."
  },
  "keywords": [
    "fotografía",
    "marketplace",
    "fotógrafos",
    "portfolio"
  ],
  "author": "LuxArs Team",
  "license": "MIT",
  "devDependencies": {
    "html-validate": "^7.0.0",
    "http-server": "^14.1.1",
    "lighthouse": "^10.0.0",
    "prettier": "^2.8.0",
    "stylelint": "^15.0.0"
  }
}
```

---

## 5. Prettier Config

Crear `landing/.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "htmlWhitespaceSensitivity": "css"
}
```

---

## 6. ESLint Config

Crear `landing/.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error"
  }
}
```

---

## 7. StyleLint Config

Crear `landing/.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": "^[a-z]([a-z0-9-]*[a-z0-9])?$",
    "custom-property-pattern": "^[a-z]([a-z0-9-]*[a-z0-9])?$",
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["not"]
      }
    ]
  }
}
```

---

## 8. lighthouse-config.json

Crear `landing/lighthouse-config.json`:

```json
{
  "extends": "lighthouse:default",
  "settings": {
    "onlyCategories": [
      "performance",
      "accessibility",
      "best-practices",
      "seo"
    ],
    "emulatedFormFactor": "mobile"
  }
}
```

---

## 9. Archivo de Headers (Netlify)

Crear `landing/netlify.toml`:

```toml
# Build configuration
[build]
publish = "."
command = ""

# Production context
[context.production]
command = ""
environment = { ENVIRONMENT = "production" }

# Preview context
[context.deploy-preview]
command = ""
environment = { ENVIRONMENT = "preview" }

# Branch deploy context
[context.branch-deploy]
command = ""
environment = { ENVIRONMENT = "staging" }

# Redirects - SPA routing
[[redirects]]
from = "/*"
to = "/index.html"
status = 200

# Redirects - Legacy URLs
[[redirects]]
from = "/blog"
to = "https://blog.luxars.com"
status = 301
force = true

# Headers - Security
[[headers]]
for = "/*"
[headers.values]
X-Frame-Options = "SAMEORIGIN"
X-Content-Type-Options = "nosniff"
X-XSS-Protection = "1; mode=block"
Referrer-Policy = "strict-origin-when-cross-origin"
Permissions-Policy = "geolocation=(), microphone=(), camera=()"

# Headers - Cache control para activos
[[headers]]
for = "/assets/*"
[headers.values]
Cache-Control = "public, max-age=31536000, immutable"

# Headers - Cache control para HTML
[[headers]]
for = "/"
[headers.values]
Cache-Control = "public, max-age=3600, must-revalidate"

# Headers - CSP (ajustar según necesidad)
[[headers]]
for = "/*"
[headers.values]
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com"
```

---

## 10. Docker Configuration

Crear `landing/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy files
COPY . .

# Install dependencies (if needed for optimization)
RUN npm install --legacy-peer-deps

# Production stage
FROM nginx:alpine

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files
COPY . /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/index.html || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 11. Nginx Configuration

Crear `landing/nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
    gzip_min_length 1000;
    gzip_level 6;
    gzip_vary on;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    error_page 404 /index.html;
}
```

---

## 12. GitHub Actions Workflow

Crear `landing/.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate HTML
        run: |
          npm install -g html-validate
          html-validate index.html
      
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          uploadArtifacts: true
          temporaryPublicStorage: true

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run QA Tests
        run: |
          echo "Running QA test cases..."
          echo "Refer to QA-TEST-CASES.md for manual testing"

  deploy:
    needs: [validate, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: '.'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'Production deploy from ${{ github.sha }}'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 1

      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Deploy preview ready! Check the workflow output for the preview URL.'
            })
```

---

## 13. Checklist de Configuración Inicial

- [ ] Crear `.gitignore`
- [ ] Crear `.env.example`
- [ ] Crear `.editorconfig`
- [ ] Crear `package.json` con scripts
- [ ] Crear `.prettierrc`
- [ ] Crear `.eslintrc.json`
- [ ] Crear `.stylelintrc.json`
- [ ] Crear `netlify.toml`
- [ ] Crear `Dockerfile`
- [ ] Crear `nginx.conf`
- [ ] Crear GitHub Actions workflow
- [ ] Configurar secrets en GitHub
- [ ] Validar todo se vea bien

---

## 14. Comandos Útiles en Desarrollo

```bash
# Iniciar servidor local
npm start

# Validar HTML
npm run validate

# Ejecutar Lighthouse
npm run lighthouse

# Construir (si es necesario)
npm run build

# Desplegar preview
npm run preview

# Desplegar producción
npm run deploy
```

---

## 15. Variables de Entorno Importantes

| Variable | Propósito | Ejemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente de ejecución | `production` |
| `REACT_APP_API_URL` | URL API backend | `https://api.luxars.com` |
| `REACT_APP_GA_ID` | Google Analytics ID | `G-XXXXXXXXXX` |
| `NETLIFY_SITE_ID` | ID del sitio Netlify | `xxxxx-xxxxx` |
| `NETLIFY_AUTH_TOKEN` | Token de autenticación | `nfp_xxx...` |

---

**Última Actualización:** 2026-05-18
**Versión:** 1.0

