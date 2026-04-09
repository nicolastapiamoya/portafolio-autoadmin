# nicolastapiamoya.com

Portfolio personal autoadministrado con blog, chat IA y panel de administración — monorepo con **Next.js 16**, **PostgreSQL**, **Ollama** y **Docker Compose**.

> El sitio es completamente autogestionado: el dueño administra contenido, configura el agente IA y revisa conversaciones desde el panel `/admin`, sin depender de servicios externos de CMS.

---

## Tabla de contenidos

- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Variables de entorno](#variables-de-entorno)
- [Desarrollo local](#desarrollo-local)
- [Despliegue en producción](#despliegue-en-producción)
- [Panel de administración](#panel-de-administración)
- [Agente IA (Chat)](#agente-ia-chat)
- [Base de datos](#base-de-datos)
- [Scripts útiles](#scripts-útiles)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, standalone output) |
| Base de datos | PostgreSQL 16 |
| ORM | Prisma 5 |
| Autenticación | NextAuth v5 (Credentials) |
| IA local | Ollama (llama3.2:1b por defecto) |
| IA externa | DeepSeek / OpenAI (configurable desde admin) |
| Estilos | Tailwind CSS v4 |
| Animaciones | Motion, @tsparticles/react |
| Contenedores | Docker Compose |

---

## Arquitectura

```
Browser
  └── Next.js 16 (App Router)
        ├── /app          → páginas públicas y admin
        ├── /api/chat     → proxy al proveedor IA activo
        ├── /lib          → cms.ts, posts.ts, ai-provider.ts, agent-context.ts
        └── Prisma Client
              └── PostgreSQL

Docker Compose
  ├── web        (Next.js — puerto 3000)
  ├── db         (PostgreSQL 16)
  ├── ollama     (servidor de modelos — puerto 11434)
  └── ollama-init (descarga el modelo al iniciar, luego sale)
```

El chat del frontend llama a `/api/chat`. Ese endpoint consulta `SiteConfig` en la DB para saber qué proveedor usar (Ollama / DeepSeek / OpenAI), construye el system prompt con los datos del perfil, experiencias, proyectos y artículos del blog, y hace streaming de la respuesta.

---

## Estructura del proyecto

```
.
├── web/
│   ├── app/
│   │   ├── admin/              # Panel de administración (requiere login)
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── settings/       # Configuración del sitio y proveedor IA
│   │   │   ├── experiences/    # CRUD de experiencia laboral
│   │   │   ├── projects/       # CRUD de proyectos
│   │   │   ├── blog/           # CRUD de artículos
│   │   │   ├── socials/        # CRUD de redes sociales
│   │   │   └── chats/          # Historial de conversaciones IA
│   │   ├── api/
│   │   │   ├── chat/           # Endpoint del agente IA (streaming SSE)
│   │   │   ├── config/         # CRUD de SiteConfig
│   │   │   ├── experiences/    # CRUD REST
│   │   │   ├── projects/       # CRUD REST
│   │   │   ├── posts/          # CRUD REST
│   │   │   └── socials/        # CRUD REST
│   │   ├── blog/               # Listado y detalle de artículos (público)
│   │   └── (home)/             # Landing page pública
│   ├── components/
│   │   ├── ChatWidget.tsx      # Chat flotante en el home
│   │   ├── AIProviderForm.tsx  # Selector de proveedor IA en admin
│   │   ├── SettingsForm.tsx    # Formulario de configuración del sitio
│   │   └── ...
│   ├── lib/
│   │   ├── ai-provider.ts      # Abstracción Ollama / DeepSeek / OpenAI
│   │   ├── agent-context.ts    # Construye el system prompt desde la DB
│   │   ├── chat.ts             # Operaciones de Chat y Message en DB
│   │   ├── cms.ts              # CRUD de Experience, Project, SocialLink, SiteConfig
│   │   └── posts.ts            # CRUD de Post
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── start.sh                # Entrypoint Docker: resolve migraciones → migrate deploy → next start
│   └── Dockerfile              # Build multi-stage standalone
├── docker-compose.yml
├── ollama-init.sh              # Descarga el modelo en Ollama al iniciar
├── .env.example
└── README.md
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL | `supersecreto123` |
| `NEXTAUTH_SECRET` | Secreto para JWT de NextAuth | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL pública del sitio | `https://tudominio.com` |
| `ADMIN_USERNAME` | Usuario del panel admin | `nicolas` |
| `ADMIN_PASSWORD` | Contraseña del panel admin | `password_seguro` |
| `OLLAMA_URL` | URL del servicio Ollama | `http://ollama:11434` |
| `OLLAMA_MODEL` | Modelo por defecto si no hay config en DB | `llama3.2:1b` |

> El proveedor IA activo se configura desde el panel admin (`/admin/settings`) y se guarda en la DB (`SiteConfig`). Las variables `OLLAMA_URL` y `OLLAMA_MODEL` solo se usan como fallback si no hay configuración guardada.

---

## Desarrollo local

### Con Docker Compose (recomendado)

Requiere Docker y Docker Compose instalados.

```bash
# 1. Variables de entorno
cp .env.example .env
# Editar .env (al menos cambiar los passwords)

# 2. Levantar todo (build + migraciones + web + ollama)
docker compose up --build

# App en http://localhost:3000
# Admin en http://localhost:3000/admin
```

El servicio `ollama-init` descargará el modelo automáticamente (~800 MB para llama3.2:1b). La primera vez puede tomar varios minutos.

### Sin Docker (hot-reload)

Requiere PostgreSQL corriendo localmente y Node.js 20+.

```bash
cd web

# 1. Instalar dependencias
npm install

# 2. Crear .env.local con tu DATABASE_URL local
echo 'DATABASE_URL="postgresql://usuario:password@localhost:5432/portfolio"' > .env.local

# 3. Aplicar migraciones
npm run db:migrate

# 4. Iniciar servidor de desarrollo
npm run dev
# App en http://localhost:3000
```

Para el chat IA en desarrollo local necesitas Ollama corriendo:
```bash
# Instalar Ollama: https://ollama.com
ollama pull llama3.2:1b
ollama serve
```

---

## Despliegue en producción

```bash
# 1. En el servidor, clonar el repo
git clone <repo> /opt/portfolio
cd /opt/portfolio

# 2. Variables de entorno de producción
cp .env.example .env
# Editar .env:
#   - NEXTAUTH_URL=https://tudominio.com
#   - Passwords seguros generados (openssl rand -base64 32)

# 3. Levantar en background
docker compose up -d --build

# 4. Ver logs
docker compose logs -f web
```

### Actualizar en producción

```bash
cd /opt/portfolio
git pull
docker compose up -d --build web
```

> Las migraciones de base de datos se aplican automáticamente en el `start.sh` al iniciar el contenedor `web`.

### Requisitos del servidor

| Recurso | Mínimo | Recomendado |
|---|---|---|
| RAM | 2 GB | 4 GB |
| CPU | 1 vCPU | 2 vCPU |
| Disco | 10 GB | 20 GB |

> Con menos de 2 GB de RAM disponibles para Ollama el modelo no cargará. En ese caso configura DeepSeek o OpenAI desde el panel admin para no depender del modelo local.

---

## Panel de administración

Acceso en `/admin/login` con las credenciales configuradas en `.env`.

| Sección | Ruta | Descripción |
|---|---|---|
| Dashboard | `/admin` | Resumen de stats |
| Configuración | `/admin/settings` | Datos del perfil, proveedor IA, redes sociales |
| Experiencia | `/admin/experiences` | CRUD de experiencia laboral |
| Proyectos | `/admin/projects` | CRUD de proyectos |
| Blog | `/admin/blog` | CRUD de artículos |
| Redes sociales | `/admin/socials` | CRUD de links sociales |
| Conversaciones | `/admin/chats` | Historial del chat IA |

---

## Agente IA (Chat)

El chat flotante en el home permite a los visitantes preguntar sobre el perfil, experiencias, proyectos y artículos del blog.

### Proveedores soportados

| Proveedor | Configuración | Modelos de ejemplo |
|---|---|---|
| **Ollama** (local) | Solo necesita el modelo descargado | `llama3.2:1b`, `phi3:mini`, `qwen2.5:0.5b` |
| **DeepSeek** | API key de [deepseek.com](https://platform.deepseek.com) | `deepseek-chat`, `deepseek-reasoner` |
| **OpenAI** | API key de [openai.com](https://platform.openai.com) | `gpt-4o-mini`, `gpt-4o` |

El proveedor se cambia desde `/admin/settings` → sección `ai_provider`. El cambio aplica inmediatamente sin reiniciar contenedores.

### Cambiar el modelo de Ollama en el servidor

Si cambias el modelo de Ollama (ej. de `llama3.2:1b` a `phi3:mini`), primero descárgalo:

```bash
# En el servidor
docker compose exec ollama ollama pull phi3:mini
```

Luego actualiza el modelo desde el panel admin o editando `docker-compose.yml` y reiniciando.

### System prompt

El agente recibe automáticamente como contexto:
- Nombre, cargo y bio del perfil (configurados en admin)
- Experiencia laboral
- Proyectos con links a demo y repo
- Artículos del blog con links directos
- Redes sociales

Si alguna sección no tiene datos, el modelo responde que esa información no está disponible (no inventa).

---

## Base de datos

### Modelos Prisma

| Modelo | Descripción |
|---|---|
| `Post` | Artículos del blog (slug, title, excerpt, content, tags, published) |
| `Experience` | Experiencia laboral (company, role, startDate, techStack…) |
| `Project` | Proyectos (title, slug, techStack, demoUrl, repoUrl…) |
| `SocialLink` | Redes sociales (platform, url, icon, active) |
| `SiteConfig` | Configuración clave-valor (perfil, proveedor IA, etc.) |
| `Chat` | Sesiones del chat IA (ip, país, userAgent…) |
| `Message` | Mensajes de cada sesión (role: user/assistant) |

### Claves de SiteConfig relevantes

| Clave | Descripción |
|---|---|
| `name` | Nombre del dueño del portfolio |
| `role` | Cargo / título profesional |
| `aboutBio` | Biografía |
| `siteUrl` | URL pública del sitio (para links del blog en el chat) |
| `ai_provider` | Proveedor IA activo: `ollama`, `deepseek` u `openai` |
| `ai_model` | Modelo a usar con el proveedor activo |
| `ai_api_key` | API key del proveedor (si aplica) |

### Crear una migración nueva

```bash
cd web
npm run db:migrate -- --name nombre_descriptivo
```

---

## Scripts útiles

```bash
# Ver logs en tiempo real
docker compose logs -f web

# Acceder a la DB directamente
docker compose exec db psql -U ntm -d portfolio

# Explorar la DB con interfaz visual (Prisma Studio)
cd web && npm run db:studio

# Regenerar el cliente Prisma tras cambiar schema
cd web && npx prisma generate

# Ver modelos descargados en Ollama
docker compose exec ollama ollama list

# Descargar un modelo en Ollama
docker compose exec ollama ollama pull llama3.2:1b
```
