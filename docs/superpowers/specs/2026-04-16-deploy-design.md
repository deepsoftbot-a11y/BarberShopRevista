# Deploy a Producción — Barbershop

**Fecha:** 2026-04-16
**Stack:** Next.js 15 · Prisma · PostgreSQL · Docker Compose · Nginx
**Subpath:** `/barbershop`

---

## Arquitectura

```
http://IP_SERVIDOR/barbershop  →  Nginx :80  →  nextjs:3100
```

```
Linux Server
├── Docker Compose
│   ├── nginx       (80:80 → proxy /barbershop → nextjs:3100)
│   ├── nextjs      (interno :3100, basePath=/barbershop)
│   └── postgres    (interno :5432)
│       └── volume: postgres_data
└── .env.production (fuera del repo, creado manualmente una vez)
```

**Reglas:**
- `nextjs` y `postgres` no exponen puertos al host — solo comunicación interna entre containers
- Solo `nginx` expone el puerto `80`
- `.env.production` nunca se sube al repo (está en `.gitignore`)
- El volumen `postgres_data` persiste entre rebuilds

---

## Archivos a crear

### `Dockerfile` (multi-stage)

```dockerfile
# Stage 1: dependencias
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: runner
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

### `docker-compose.yml`

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

### `nginx.conf`

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

### `next.config.js` — agregar `basePath`

```js
const nextConfig = {
  basePath: '/barbershop',
  output: 'standalone',
  // ... resto de config existente
};
```

> `output: 'standalone'` es requerido para el Dockerfile multi-stage.

### `deploy.sh`

```bash
#!/bin/bash
set -e
git pull origin master
docker compose --env-file .env.production up -d --build
docker compose exec nextjs npx prisma migrate deploy
echo "Deploy completado."
```

---

## Variables de entorno (`.env.production`)

Crear manualmente en el servidor. Nunca en el repo.

```env
# PostgreSQL (el hostname es el nombre del servicio Docker)
DATABASE_URL="postgresql://barberia:PASSWORD@postgres:5432/barberia"
POSTGRES_USER=barberia
POSTGRES_PASSWORD=PASSWORD_SEGURO
POSTGRES_DB=barberia

# App
JWT_SECRET="string-aleatorio-32-chars"
ADMIN_EMAIL="admin@barberia.com"
ADMIN_PASSWORD_HASH="$2a$12$..."
RESEND_API_KEY="re_..."
FROM_EMAIL="reservas@dominio.com"
TURNSTILE_SECRET_KEY="..."
NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
TIMEZONE="America/Mexico_City"
PORT=3100
```

---

## Flujo de deploy

### Primera vez

```bash
# En el servidor
git clone <repo> barberia
cd barberia
# Crear .env.production con los valores reales
nano .env.production
bash deploy.sh
```

### Actualizaciones posteriores

```bash
cd barberia
bash deploy.sh
```

---

## .gitignore — agregar

```
.env.production
```

---

## Checklist pre-deploy

- [ ] `next.config.js` tiene `basePath: '/barbershop'` y `output: 'standalone'`
- [ ] `.env.production` creado en el servidor con valores reales
- [ ] `.env.production` en `.gitignore`
- [ ] Docker y Docker Compose instalados en el servidor
- [ ] Puerto 80 abierto en el firewall del servidor
