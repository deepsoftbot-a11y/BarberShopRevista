# Production Deploy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Configurar Docker Compose + Nginx para desplegar la app Next.js en producción bajo la subdirección `/barbershop`.

**Architecture:** Tres contenedores Docker (nginx, nextjs, postgres) orquestados con Docker Compose. Nginx en puerto 80 proxea `/barbershop` al contenedor Next.js en puerto 3100. PostgreSQL persiste datos en un Docker volume.

**Tech Stack:** Next.js 15, Prisma 5, PostgreSQL 16, Docker Compose v2, Nginx Alpine, node:22-alpine.

---

## Task 1: Actualizar `.gitignore`

**Files:**
- Modify: `.gitignore`

**Step 1: Agregar `.env.production` al gitignore**

Al final del archivo `.gitignore`, agregar:

```
# production secrets
.env.production
```

**Step 2: Verificar que no está trackeado**

```bash
git check-ignore -v .env.production
```
Expected: `.gitignore:XX:.env.production  .env.production`

**Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .env.production"
```

---

## Task 2: Modificar `next.config.ts` — basePath + standalone

**Files:**
- Modify: `next.config.ts`

**Context:** El archivo actual tiene solo `images.remotePatterns`. Necesitamos agregar `basePath: '/barbershop'` y `output: 'standalone'`.

- `basePath` indica a Next.js que la app vive bajo `/barbershop`, afectando rutas internas, links y assets.
- `output: 'standalone'` genera `.next/standalone/` con un `server.js` mínimo — requerido para el Dockerfile multi-stage.

**Step 1: Editar `next.config.ts`**

Reemplazar el contenido completo con:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/barbershop",
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

**Step 2: Verificar que el build local sigue funcionando**

```bash
npm run build
```
Expected: build exitoso, sin errores. Al final debe aparecer `✓ Generating static pages`.
Verificar que existe `.next/standalone/server.js` después del build.

```bash
ls .next/standalone/server.js
```
Expected: el archivo existe.

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: add basePath /barbershop and standalone output for Docker"
```

---

## Task 3: Crear `Dockerfile` (multi-stage)

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Context:** Multi-stage build para imagen final ligera (~200MB vs ~1GB). Tres stages:
1. `deps`: solo instala dependencias npm
2. `builder`: genera Prisma client y hace `next build`
3. `runner`: copia solo el output de standalone — sin código fuente ni devDependencies

**Step 1: Crear `.dockerignore`**

```
node_modules
.next
.git
*.md
docs/
prisma/migrations
.env*
npm-debug.log*
```

**Step 2: Crear `Dockerfile`**

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3100
CMD ["node", "server.js"]
```

**Step 3: Verificar build de imagen localmente (opcional, requiere Docker)**

```bash
docker build -t barberia-test .
```
Expected: build exitoso en 3 stages, imagen creada.

**Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat: add multi-stage Dockerfile for Next.js production build"
```

---

## Task 4: Crear `nginx.conf`

**Files:**
- Create: `nginx.conf`

**Context:** Nginx actúa como reverse proxy. La location `/barbershop` proxea todo el tráfico al servicio `nextjs` en el puerto 3100. El hostname `nextjs` es el nombre del servicio definido en docker-compose — Docker Compose tiene DNS interno que resuelve nombres de servicio.

**Step 1: Crear `nginx.conf`**

```nginx
server {
    listen 80;

    location /barbershop {
        proxy_pass         http://nextjs:3100;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Step 2: Commit**

```bash
git add nginx.conf
git commit -m "feat: add nginx reverse proxy config for /barbershop subpath"
```

---

## Task 5: Crear `docker-compose.yml`

**Files:**
- Create: `docker-compose.yml`

**Context:**
- `postgres`: usa variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` del `.env.production` para inicializar la DB automáticamente en el primer arranque.
- `nextjs`: construye la imagen desde el `Dockerfile`. `depends_on` solo garantiza que postgres *arrancó*, no que está listo — por eso las migraciones se corren manualmente en `deploy.sh` después.
- `nginx`: monta `nginx.conf` como read-only.
- El volumen `postgres_data` es gestionado por Docker — sobrevive a `docker compose down`, pero NO a `docker compose down -v` (no usar ese comando en producción).

**Step 1: Crear `docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    env_file: .env.production
    restart: always

  nextjs:
    build: .
    env_file: .env.production
    depends_on:
      - postgres
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - nextjs
    restart: always

volumes:
  postgres_data:
```

**Step 2: Commit**

```bash
git add docker-compose.yml
git commit -m "feat: add docker-compose with nextjs, postgres, and nginx services"
```

---

## Task 6: Crear `deploy.sh`

**Files:**
- Create: `deploy.sh`

**Context:** Script de deploy manual. `set -e` hace que el script aborte si cualquier comando falla. Las migraciones se corren DESPUÉS de que los containers están corriendo, porque necesitan que PostgreSQL esté disponible.

**Step 1: Crear `deploy.sh`**

```bash
#!/bin/bash
set -e

echo ">>> Pulling latest code..."
git pull origin master

echo ">>> Building and starting containers..."
docker compose --env-file .env.production up -d --build

echo ">>> Waiting for postgres to be ready..."
sleep 5

echo ">>> Running database migrations..."
docker compose exec nextjs npx prisma migrate deploy

echo ">>> Deploy completado."
```

**Step 2: Hacer el script ejecutable**

```bash
chmod +x deploy.sh
```

**Step 3: Commit**

```bash
git add deploy.sh
git commit -m "feat: add deploy.sh script for manual production deployments"
```

---

## Task 7: Verificación en el servidor (checklist manual)

Este task se ejecuta en el servidor Linux de producción, no localmente.

**Pre-requisitos en el servidor:**

```bash
# Verificar Docker instalado
docker --version
# Expected: Docker version 24.x o superior

# Verificar Docker Compose v2
docker compose version
# Expected: Docker Compose version v2.x

# Verificar puerto 80 disponible
sudo ss -tlnp | grep :80
# Expected: sin output (nadie usando el puerto 80)
```

**Step 1: Clonar el repo en el servidor**

```bash
git clone <URL_DEL_REPO> barberia
cd barberia
```

**Step 2: Crear `.env.production`**

```bash
nano .env.production
```

Pegar y completar con valores reales:

```env
DATABASE_URL="postgresql://barberia:PASSWORD_SEGURO@postgres:5432/barberia"
POSTGRES_USER=barberia
POSTGRES_PASSWORD=PASSWORD_SEGURO
POSTGRES_DB=barberia

JWT_SECRET="string-aleatorio-minimo-32-caracteres"
ADMIN_EMAIL="admin@barberia.com"
ADMIN_PASSWORD_HASH="$2a$12$..."
RESEND_API_KEY="re_..."
FROM_EMAIL="reservas@dominio.com"
TURNSTILE_SECRET_KEY="..."
NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
TIMEZONE="America/Mexico_City"
PORT=3100
```

> IMPORTANTE: `DATABASE_URL` usa `postgres` como host (nombre del servicio Docker), NO `localhost`.

**Step 3: Ejecutar deploy**

```bash
bash deploy.sh
```

**Step 4: Verificar que los 3 containers están corriendo**

```bash
docker compose ps
```
Expected: los tres servicios `postgres`, `nextjs`, `nginx` con status `Up`.

**Step 5: Verificar la app responde**

```bash
curl -I http://localhost/barbershop
```
Expected: `HTTP/1.1 200 OK` o `HTTP/1.1 308 Permanent Redirect`

**Step 6: Sembrar datos iniciales (solo primera vez)**

```bash
docker compose exec nextjs npx prisma db seed
```

---

## Flujo de updates posteriores

Cada vez que haya cambios en el repo:

```bash
cd barberia
bash deploy.sh
```

---

## Notas importantes

| Cosa | Por qué importa |
|------|----------------|
| `DATABASE_URL` apunta a `postgres` no `localhost` | Docker Compose tiene DNS interno por nombre de servicio |
| `docker compose down -v` destruye los datos | Nunca usar en producción — omitir el flag `-v` |
| `.env.production` nunca en el repo | Contiene secretos — está en `.gitignore` |
| `sleep 5` en `deploy.sh` | Margen para que PostgreSQL acepte conexiones antes de las migraciones |
