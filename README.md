# Squadmaker REST API - Prueba Técnica

🌐 Español | **[English](README.en.md)**

Una API REST profesional para gestión de chistes construida con **Arquitectura Hexagonal**, **TDD**, y **funcionalidades con IA**. Este proyecto demuestra prácticas avanzadas de desarrollo Node.js/TypeScript con pipeline CI/CD completo y despliegue en producción.

## 🚀 Demo en Vivo

- **API en Producción:** <https://squadmaker-backend-test-production.up.railway.app>
- **Documentación Swagger:** <https://squadmaker-backend-test-production.up.railway.app/api-docs>
- **Health Check:** <https://squadmaker-backend-test-production.up.railway.app/health>

## ✨ Características

### Funcionalidades Principales

- ✅ **CRUD Completo** para chistes (Crear, Leer, Actualizar, Eliminar)
- ✅ **Integración con APIs Externas** (Chuck Norris API, Dad Jokes API)
- ✅ **Operaciones Matemáticas** (Cálculo de MCM, incremento de números)
- ✅ **Fusión de Chistes con IA** usando Claude API (Anthropic)
- ✅ **Consultas SQL** por nombre de usuario y categoría
- ✅ **Base de Datos PostgreSQL** con Prisma ORM
- ✅ **Documentación Interactiva** con Swagger/OpenAPI

### Excelencia Técnica

- ✅ **Arquitectura Hexagonal** (Puertos y Adaptadores)
- ✅ **TDD Estricto** (Test-Driven Development) con 388+ tests
- ✅ **85%+ de Cobertura de Código**
- ✅ **Pipeline CI/CD** con GitHub Actions
- ✅ **Docker** multi-entorno (dev, CI, producción)
- ✅ **Despliegue en Producción** en Railway
- ✅ **TypeScript** en modo estricto
- ✅ **ESLint + Prettier** con hooks pre-commit de Husky

## 🛠️ Stack Tecnológico

### Core

- **Runtime:** Node.js 20+
- **Lenguaje:** TypeScript (modo estricto)
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL 15+
- **ORM:** Prisma 7
- **Testing:** Jest + Supertest
- **Validación:** Zod

### DevOps y Herramientas

- **Contenedores:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Despliegue:** Railway
- **Documentación:** Swagger/OpenAPI (swagger-jsdoc + swagger-ui-express)
- **Logging:** Winston
- **Calidad de Código:** ESLint, Prettier, Husky

### Servicios Externos

- **APIs de Chistes:** Chuck Norris API, icanhazdadjoke API
- **Integración IA:** Anthropic Claude API (Sonnet 4.5)

## 📦 Instalación

### Prerrequisitos

- Docker & Docker Compose
- pnpm 10.27.0+ (solo si ejecutas sin Docker)

### Inicio Rápido (Docker - Recomendado) 🐳

La forma más rápida de comenzar - **solo 2 comandos**:

```bash
# 1. Clonar y entrar al proyecto
git clone https://github.com/CristianJDelRio/squadmaker-backend-test.git
cd squadmaker-test

# 2. Iniciar todo con Docker
pnpm run docker:dev:up
```

¡Eso es todo! 🚀

**Qué sucede automáticamente:**

1. ✅ PostgreSQL 15 inicia y espera el healthcheck
2. ✅ Las migraciones se ejecutan (`prisma migrate deploy`)
3. ✅ Se crean los datos de prueba (4 usuarios, 3 categorías, 36 chistes)
4. ✅ El servidor de desarrollo inicia con hot reload

**URLs Disponibles:**

| URL | Descripción |
|-----|-------------|
| <http://localhost:3000> | URL Base de la API |
| <http://localhost:3000/api-docs> | Documentación Interactiva Swagger |
| <http://localhost:3000/health> | Health Check |
| <http://localhost:3000/api/v1/jokes> | Listar todos los chistes (36 creados) |

**Comandos útiles:**

```bash
pnpm run docker:dev:up      # Iniciar todo
pnpm run docker:dev:down    # Detener todo
pnpm run docker:dev:logs    # Ver logs
pnpm run docker:dev:rebuild # Reconstruir desde cero
```

### Inicio Rápido (Sin Docker)

Si prefieres ejecutar localmente sin Docker:

1. **Clonar e instalar**

```bash
git clone <repository-url>
cd squadmaker-test
pnpm install
```

2. **Configurar entorno**

```bash
cp .env.example .env
```

Edita `.env` con tu conexión a PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/squadmakers_db"
NODE_ENV="development"
PORT=3000
LOG_LEVEL="debug"
CHUCK_NORRIS_API_URL="https://api.chucknorris.io"
DAD_JOKES_API_URL="https://icanhazdadjoke.com"
# Opcional: ANTHROPIC_API_KEY="tu-api-key-aqui"
```

3. **Configurar base de datos y ejecutar**

```bash
pnpm run db:migrate    # Ejecutar migraciones
pnpm run db:seed       # Crear datos de prueba
pnpm run dev           # Iniciar servidor
```

La API estará disponible en `http://localhost:3000`

## 🧪 Testing

### Ejecutar todos los tests

```bash
pnpm test
```

### Ejecutar suites específicas

```bash
pnpm run test:unit           # Solo tests unitarios
pnpm run test:integration    # Solo tests de integración
pnpm run test:e2e           # Solo tests E2E
pnpm run test:coverage      # Reporte de cobertura
```

### Configuración del Entorno de Tests

**Tests unitarios** se ejecutan sin dependencias externas.

**Tests de integración y E2E** requieren una base de datos PostgreSQL corriendo. Tienes dos opciones:

**Opción 1: Usar Docker (Recomendado)**

```bash
# Iniciar el entorno de desarrollo (incluye base de datos de test)
pnpm run docker:dev:up

# Ejecutar tests (en otra terminal)
pnpm run test:integration
pnpm run test:e2e
```

**Opción 2: Configuración manual**

Crea un archivo `.env.test` con tu conexión a la base de datos de test:

```bash
cp .env.example .env.test
```

Edita `.env.test`:

```env
DATABASE_URL="postgresql://squadmakers_user:squadmakers_dev_password@localhost:5432/squadmakers_db_test"
NODE_ENV="test"
PORT=3001
LOG_LEVEL="error"
CHUCK_NORRIS_API_URL="https://api.chucknorris.io"
DAD_JOKES_API_URL="https://icanhazdadjoke.com"
```

Luego ejecuta las migraciones para la base de datos de test:

```bash
pnpm run db:migrate:test
```

### Resultados de Tests

- **Total de Tests:** 388+
- **Tests Unitarios:** 240+
- **Tests de Integración:** 80+
- **Tests E2E:** 68+
- **Cobertura:** 85%+

## 🔌 Endpoints de la API

### Health Check

```http
GET /health
```

### Gestión de Chistes

#### Listar Todos los Chistes (con filtros)

```http
GET /api/v1/jokes
GET /api/v1/jokes?userId={uuid}
GET /api/v1/jokes?categoryId={uuid}
GET /api/v1/jokes?userName=manolito
GET /api/v1/jokes?categoryName=humor%20negro
GET /api/v1/jokes?userName=manolito&categoryName=humor%20negro
```

#### Crear Chiste

```http
POST /api/v1/jokes
Content-Type: application/json

{
  "text": "¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.",
  "userId": "uuid-aqui",
  "categoryId": "uuid-aqui"
}
```

#### Obtener Chiste por ID

```http
GET /api/v1/jokes/{id}
```

#### Actualizar Chiste

```http
PUT /api/v1/jokes/{id}
Content-Type: application/json

{
  "text": "Texto del chiste actualizado"
}
```

#### Eliminar Chiste

```http
DELETE /api/v1/jokes/{id}
```

#### Obtener Chiste Externo

```http
GET /api/v1/jokes/chuck    # Chiste de Chuck Norris
GET /api/v1/jokes/dad      # Dad joke
```

#### Chistes Pareados con IA

```http
POST /api/v1/jokes/paired
```

Retorna 5 pares de chistes fusionados con IA:

```json
[
  {
    "chuck": "Chuck Norris puede dividir por cero.",
    "dad": "¿Por qué los científicos no confían en los átomos? ¡Porque inventan todo!",
    "combined": "Chuck Norris puede dividir por cero porque los átomos inventan todo, y él inventa sus propias reglas."
  }
]
```

> **⚠️ Nota:** Este endpoint usa Claude API (Anthropic) que tiene costo por solicitud. Por favor úsalo responsablemente y evita llamadas excesivas para prevenir cargos inesperados. Cada solicitud procesa 10 chistes (5 Chuck + 5 Dad) y genera 5 combinaciones con IA. Considera implementar rate limiting o caché para uso en producción. 💸

### Operaciones Matemáticas

#### Calcular MCM (Mínimo Común Múltiplo)

```http
GET /api/v1/math/lcm?numbers=12,18,24
```

Respuesta:

```json
{
  "numbers": [12, 18, 24],
  "lcm": 72
}
```

#### Incrementar Número

```http
GET /api/v1/math/increment?number=42
```

Respuesta:

```json
{
  "original": 42,
  "incremented": 43
}
```

## 📊 Ejemplos de Consultas SQL

Como parte de los requerimientos de la prueba técnica, se solicitaron las siguientes consultas SQL:

1. Obtener todos los chistes creados por el usuario "Manolito"
2. Obtener todos los chistes de la categoría "Humor negro"
3. Obtener todos los chistes de "Humor negro" creados por "Manolito"

En lugar de implementarlas como consultas separadas a la base de datos, decidí **integrarlas como funcionalidad de la API REST** con capacidades de filtrado apropiadas, haciéndolas más accesibles y mantenibles.

### Endpoints REST API

#### Consulta 1: Obtener todos los chistes de "Manolito"

```http
GET /api/v1/jokes?userName=manolito
```

#### Consulta 2: Obtener todos los chistes de "Humor negro"

```http
GET /api/v1/jokes?categoryName=humor%20negro
```

#### Consulta 3: Obtener chistes de "Humor negro" de "Manolito"

```http
GET /api/v1/jokes?userName=manolito&categoryName=humor%20negro
```

### Consultas Directas en PostgreSQL

Si prefieres ejecutar estas consultas directamente en PostgreSQL:

**Consulta 1: Saca todos los chistes creados por el usuario "Manolito"**

```sql
SELECT
  j.id,
  j.text,
  u.name as user_name,
  c.name as category_name,
  j."createdAt",
  j."updatedAt"
FROM jokes j
INNER JOIN users u ON j."userId" = u.id
WHERE u.name = 'manolito'
ORDER BY j."createdAt" DESC;
```

**Consulta 2: Saca todos los chistes de la temática "Humor negro"**

```sql
SELECT
  j.id,
  j.text,
  u.name as user_name,
  c.name as category_name,
  j."createdAt",
  j."updatedAt"
FROM jokes j
INNER JOIN users u ON j."userId" = u.id
INNER JOIN categories c ON j."categoryId" = c.id
WHERE c.name = 'humor negro'
ORDER BY j."createdAt" DESC;
```

**Consulta 3: Saca todos los chistes de la temática "Humor negro" creados por el usuario "Manolito"**

```sql
SELECT
  j.id,
  j.text,
  u.name as user_name,
  c.name as category_name,
  j."createdAt",
  j."updatedAt"
FROM jokes j
INNER JOIN users u ON j."userId" = u.id
INNER JOIN categories c ON j."categoryId" = c.id
WHERE u.name = 'manolito'
  AND c.name = 'humor negro'
ORDER BY j."createdAt" DESC;
```

**Conectar a PostgreSQL:**

```bash
# Usando Docker
docker exec -it squadmakers-postgres-dev psql -U squadmakers_user -d squadmakers_db

# O usando pnpm con Prisma Studio
pnpm run db:studio
```

### Cómo Funciona (Implementación con Prisma)

Estas consultas usan el filtrado relacional de Prisma, que internamente genera SQL optimizado con INNER JOINs para filtrar por nombres de entidades relacionadas en lugar de solo IDs.

## 🗄️ Seed de Base de Datos

El script de seed crea:

- 4 usuarios: `manolito`, `pepe`, `isabel`, `pedro`
- 3 categorías: `humor negro`, `humor amarillo`, `chistes verdes`
- 36 chistes (3 por usuario por categoría)

```bash
pnpm run db:seed
```

## 🏗️ Estructura del Proyecto

```
squadmaker-test/
├── src/
│   ├── contexts/                  # Contextos delimitados (DDD)
│   │   ├── jokes/                # Contexto de Chistes
│   │   │   ├── domain/           # Entidades, Value Objects, Interfaces de Repositorio
│   │   │   ├── application/      # Casos de Uso
│   │   │   └── infrastructure/   # Prisma, APIs Externas
│   │   ├── paired-jokes/         # Fusión de chistes con IA
│   │   ├── math/                 # Operaciones matemáticas
│   │   └── shared/               # Kernel compartido
│   ├── shared/                   # Infraestructura compartida
│   │   └── infrastructure/
│   │       ├── config/           # Configuración de entorno
│   │       ├── logger/           # Logger Winston
│   │       └── http/             # Servidor Express, rutas, middlewares
│   └── index.ts                  # Punto de entrada de la aplicación
├── tests/
│   ├── unit/                     # Tests unitarios
│   ├── integration/              # Tests de integración
│   ├── e2e/                      # Tests end-to-end
│   └── helpers/                  # Utilidades de testing
├── prisma/
│   ├── schema.prisma             # Esquema de base de datos
│   ├── seed.ts                   # Script de seed
│   └── migrations/               # Migraciones de base de datos
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI/CD
├── docker-compose.dev.yml        # Entorno de desarrollo
├── docker-compose.ci.yml         # Entorno de CI
├── Dockerfile                    # Imagen de producción
└── package.json
```

## 🏛️ Arquitectura

Este proyecto sigue **Arquitectura Hexagonal** (Puertos y Adaptadores) con principios de **Domain-Driven Design**:

### Capas

1. **Capa de Dominio** (Lógica de Negocio)
   - Entidades (Joke, PairedJoke)
   - Value Objects (JokeId, JokeText, UserId, CategoryId)
   - Interfaces de Repositorio (Puertos)
   - TypeScript puro, sin dependencias externas

2. **Capa de Aplicación** (Casos de Uso)
   - CreateJoke, GetJoke, UpdateJoke, DeleteJoke
   - FetchExternalJoke, FetchPairedJokes
   - CalculateLCM, IncrementNumber
   - Orquesta objetos de dominio

3. **Capa de Infraestructura** (Detalles Técnicos)
   - PrismaJokeRepository (Adaptador)
   - ChuckNorrisApiService, DadJokesApiService, ClaudeApiService
   - Rutas HTTP, Controladores, Middlewares
   - Base de datos, Logging, APIs Externas

### Patrones de Diseño

- Patrón Repository
- Inyección de Dependencias
- Object Mother (para testing)
- Patrón Factory
- Manejo de errores con errores de dominio personalizados

## 🧪 Test-Driven Development (TDD)

Cada funcionalidad fue construida siguiendo el ciclo estricto **Red-Green-Refactor**:

1. **RED:** Escribir primero un test que falle
2. **GREEN:** Escribir el código mínimo para pasar el test
3. **REFACTOR:** Mejorar la calidad del código manteniendo los tests en verde

### Pirámide de Tests

- **Tests Unitarios (60%):** Rápidos, aislados, prueban unidades individuales
- **Tests de Integración (25%):** Base de datos, servicios externos
- **Tests E2E (15%):** Ciclo completo de request/response HTTP

### Umbrales de Cobertura

```json
{
  "branches": 85,
  "functions": 85,
  "lines": 85,
  "statements": 85
}
```

## 🚀 Pipeline CI/CD

### Workflow de GitHub Actions

El pipeline de CI se ejecuta en cada push y pull request:

1. **Lint & Tests Unitarios** (Feedback rápido ~1-2 min)
   - Verificación de calidad de código con ESLint
   - Ejecución de tests unitarios
   - Ejecución paralela para velocidad

2. **Type Check & Build** (~1-2 min)
   - Compilación de TypeScript
   - Verificación del build

3. **Tests de Integración & E2E** (~3-5 min)
   - Entorno Docker Compose
   - Base de datos PostgreSQL
   - Suite completa de tests
   - Limpieza

4. **CI Success** (Resumen)
   - Todos los jobs deben pasar

### Despliegue

Despliegue automático a Railway en push a `main`:

- Construir imagen Docker
- Ejecutar migraciones de base de datos
- Desplegar a producción
- Verificación de health check

## 🐳 Docker

### Desarrollo

```bash
pnpm run docker:dev:up         # Iniciar con hot reload
pnpm run docker:dev:down       # Detener
pnpm run docker:dev:logs       # Ver logs
```

### CI/CD

```bash
pnpm run docker:ci:up          # Ejecutar suite completa de tests
```

### Producción

```bash
docker build -t squadmakers-api .
docker run -p 3000:3000 --env-file .env squadmakers-api
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev                   # Iniciar servidor dev con hot reload
pnpm run build                 # Build para producción
pnpm start                     # Iniciar servidor de producción

# Testing
pnpm test                      # Ejecutar todos los tests
pnpm run test:watch            # Modo watch
pnpm run test:coverage         # Reporte de cobertura
pnpm run test:unit             # Solo tests unitarios
pnpm run test:integration      # Tests de integración
pnpm run test:e2e             # Tests E2E

# Calidad de Código
pnpm run lint                  # Ejecutar ESLint
pnpm run lint:fix              # Corregir problemas de ESLint
pnpm run format                # Formatear con Prettier
pnpm run type-check            # Verificación de TypeScript

# Base de Datos
pnpm run db:migrate            # Ejecutar migraciones
pnpm run db:seed               # Seed de base de datos
pnpm run db:studio             # Abrir Prisma Studio
pnpm run db:generate           # Generar Prisma Client

# Docker
pnpm run docker:dev:up         # Iniciar entorno de desarrollo
pnpm run docker:ci:up          # Ejecutar tests de CI
```

## 🔒 Variables de Entorno

Variables de entorno requeridas:

```env
# Base de Datos
DATABASE_URL=postgresql://user:password@host:port/database

# Servidor
NODE_ENV=development|production
PORT=3000
LOG_LEVEL=debug|info|warn|error

# APIs Externas
CHUCK_NORRIS_API_URL=https://api.chucknorris.io
DAD_JOKES_API_URL=https://icanhazdadjoke.com

# Opcional: Integración IA
ANTHROPIC_API_KEY=tu-api-key
```

## 🚧 Mejoras Futuras

Aunque este proyecto demuestra arquitectura lista para producción y mejores prácticas, aquí hay algunas mejoras que podrían implementarse con más tiempo:

### Rendimiento y Escalabilidad

- **Capa de Caché con Redis**
- **Optimización de Base de Datos**
- **Rate Limiting por Usuario**

### Funcionalidades

- **Paginación y Filtrado Avanzado**
- **Autenticación y Autorización de Usuarios**
- **Reacciones y Analíticas de Chistes**
- **Funcionalidades Avanzadas de IA**

### Monitoreo y Observabilidad

- **Integración APM**
- **Logging Estructurado**
- **Health Checks Mejorados**

### Testing y Calidad

- **Load Testing**
- **Contract Testing**
- **Mutation Testing**

### DevOps e Infraestructura

- **Despliegue Multi-Región**
- **Orquestación con Kubernetes**
- **Infrastructure as Code**

Intencionalmente omití la mayoría de estas mejoras para enfocarme en demostrar:

- Principios de arquitectura limpia
- Test-driven development
- Despliegue en producción
- Implementación de CI/CD

La implementación actual prioriza **calidad de código**, **testabilidad** y **mantenibilidad** sobre completitud de funcionalidades.

## 🤝 Contribuciones

Este es un proyecto de prueba técnica. No se esperan contribuciones, pero el código demuestra:

- Principios de código limpio
- Principios SOLID
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Separación de responsabilidades
- Inversión de dependencias

## 📄 Licencia

MIT

## 👨‍💻 Autor

**Cristian Del Rio**

Construido como prueba técnica para demostrar:

- Desarrollo avanzado en Node.js/TypeScript
- Implementación de Arquitectura Hexagonal
- Test-Driven Development (TDD)
- Mejores prácticas de CI/CD
- Despliegue listo para producción
- Capacidades de integración con IA

---

**⭐ ¡Si encontraste útil este proyecto, considera darle una estrella!**
