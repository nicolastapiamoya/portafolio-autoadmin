# nicolastapiamoya.dev

Portfolio personal + blog — monorepo con **Next.js 16**, **PostgreSQL** y **Docker Compose**.

## Estructura

```
.
├── web/                  # App Next.js 16 (App Router)
│   ├── app/              # Rutas y páginas
│   ├── components/       # Componentes React
│   ├── lib/posts.ts      # Acceso a DB via Prisma
│   ├── auth.ts           # NextAuth v5 (credentials)
│   ├── prisma/           # Schema + migraciones
│   └── Dockerfile        # Build multi-stage standalone
├── docker-compose.yml    # PostgreSQL + web
├── .env.example          # Plantilla de variables
└── README.md
```

## Desarrollo local con Docker Compose

```bash
# 1. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores (al menos cambiar passwords)

# 2. Levantar todo (construye imagen, aplica migraciones, inicia web)
docker compose up --build

# App disponible en http://localhost:3000
```

## Desarrollo local sin Docker (hot-reload)

```bash
# Requiere PostgreSQL corriendo localmente
cd web
cp .env .env.local   # ya tiene los valores por defecto
npm install
npm run db:migrate   # crea las tablas
npm run dev          # http://localhost:3000
```

## Despliegue en servidor

```bash
# En el servidor, clonar el repo y:
cp .env.example .env
# Editar .env con valores de producción (NEXTAUTH_URL, passwords seguros)

docker compose up -d --build
```

## Admin / Blog

| Ruta | Descripción |
|---|---|
| `/` | Landing page |
| `/blog` | Listado de posts |
| `/blog/[slug]` | Post individual |
| `/admin` | Crear post (requiere login) |
| `/admin/login` | Login de administrador |

Las credenciales del admin se configuran en `.env`:
```
ADMIN_USERNAME=nicolas
ADMIN_PASSWORD=tu_password_seguro
```

## Stack

- **Next.js 16** — App Router, standalone output
- **PostgreSQL 16** — Base de datos
- **Prisma 5** — ORM + migraciones
- **NextAuth v5** — Autenticación con Credentials
- **@react-spring/web** — Animaciones
- **react-parallax** — Efectos de parallax
- **@tsparticles/react** — Partículas en Hero
- **Tailwind CSS v4** — Estilos
