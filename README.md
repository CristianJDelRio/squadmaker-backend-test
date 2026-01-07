# Squadmaker REST API - Technical Challenge

A professional REST API for joke management built with **Hexagonal Architecture**, **TDD**, and **AI-powered features**. This project demonstrates advanced Node.js/TypeScript development practices with complete CI/CD pipeline and production deployment.

## 🚀 Live Demo

- **Production API:** https://squadmaker-backend-test-production.up.railway.app
- **Swagger Documentation:** https://squadmaker-backend-test-production.up.railway.app/api-docs
- **Health Check:** https://squadmaker-backend-test-production.up.railway.app/health

## ✨ Features

### Core Functionality
- ✅ **Complete CRUD** for jokes (Create, Read, Update, Delete)
- ✅ **External API Integration** (Chuck Norris API, Dad Jokes API)
- ✅ **Mathematical Operations** (LCM calculation, number increment)
- ✅ **AI-Powered Joke Fusion** using Claude API (Anthropic)
- ✅ **SQL Queries** by user name and category name
- ✅ **PostgreSQL Database** with Prisma ORM
- ✅ **Interactive API Documentation** with Swagger/OpenAPI

### Technical Excellence
- ✅ **Hexagonal Architecture** (Ports & Adapters)
- ✅ **Strict TDD** (Test-Driven Development) with 388+ tests
- ✅ **85%+ Code Coverage**
- ✅ **CI/CD Pipeline** with GitHub Actions
- ✅ **Docker** multi-environment setup (dev, CI, production)
- ✅ **Production Deployment** on Railway
- ✅ **TypeScript** strict mode
- ✅ **ESLint + Prettier** with Husky pre-commit hooks

## 🛠️ Tech Stack

### Core
- **Runtime:** Node.js 20+
- **Language:** TypeScript (strict mode)
- **Framework:** Express.js
- **Database:** PostgreSQL 15+
- **ORM:** Prisma 7
- **Testing:** Jest + Supertest
- **Validation:** Zod

### DevOps & Tools
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Deployment:** Railway
- **Documentation:** Swagger/OpenAPI (swagger-jsdoc + swagger-ui-express)
- **Logging:** Winston
- **Code Quality:** ESLint, Prettier, Husky

### External Services
- **Joke APIs:** Chuck Norris API, icanhazdadjoke API
- **AI Integration:** Anthropic Claude API (Sonnet 4.5)

## 📦 Installation

### Prerequisites
- Node.js 20+
- pnpm 10.27.0+
- Docker & Docker Compose (for local development)
- PostgreSQL 15+ (or use Docker)

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd squadmaker-test
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://squadmakers_user:squadmakers_password@localhost:5432/squadmakers_db"
NODE_ENV="development"
PORT=3000
LOG_LEVEL="info"

# External APIs
CHUCK_NORRIS_API_URL="https://api.chucknorris.io"
DAD_JOKES_API_URL="https://icanhazdadjoke.com"

# Optional: Claude API for AI-powered joke fusion
ANTHROPIC_API_KEY="your-api-key-here"
```

4. **Start PostgreSQL with Docker**
```bash
pnpm run docker:dev:up
```

5. **Run database migrations**
```bash
pnpm run db:migrate
```

6. **Seed the database** (optional - creates test data)
```bash
pnpm run db:seed
```

7. **Start the development server**
```bash
pnpm run dev
```

The API will be available at `http://localhost:3000`

## 🧪 Testing

### Run all tests
```bash
pnpm test
```

### Run specific test suites
```bash
pnpm run test:unit           # Unit tests only
pnpm run test:integration    # Integration tests only
pnpm run test:e2e           # E2E tests only
pnpm run test:coverage      # Coverage report
```

### Test Results
- **Total Tests:** 388+
- **Unit Tests:** 240+
- **Integration Tests:** 80+
- **E2E Tests:** 68+
- **Coverage:** 85%+

## 🔌 API Endpoints

### Health Check
```http
GET /health
```

### Jokes Management

#### List All Jokes (with filters)
```http
GET /api/v1/jokes
GET /api/v1/jokes?userId={uuid}
GET /api/v1/jokes?categoryId={uuid}
GET /api/v1/jokes?userName=manolito
GET /api/v1/jokes?categoryName=humor%20negro
GET /api/v1/jokes?userName=manolito&categoryName=humor%20negro
```

#### Create Joke
```http
POST /api/v1/jokes
Content-Type: application/json

{
  "text": "Why did the chicken cross the road?",
  "userId": "uuid-here",
  "categoryId": "uuid-here"
}
```

#### Get Joke by ID
```http
GET /api/v1/jokes/{id}
```

#### Update Joke
```http
PUT /api/v1/jokes/{id}
Content-Type: application/json

{
  "text": "Updated joke text"
}
```

#### Delete Joke
```http
DELETE /api/v1/jokes/{id}
```

#### Fetch External Joke
```http
GET /api/v1/jokes/chuck    # Chuck Norris joke
GET /api/v1/jokes/dad      # Dad joke
```

#### AI-Powered Paired Jokes
```http
POST /api/v1/jokes/paired
```

Returns 5 pairs of jokes fused with AI:
```json
[
  {
    "chuck": "Chuck Norris can divide by zero.",
    "dad": "Why don't scientists trust atoms? Because they make up everything!",
    "combined": "Chuck Norris can divide by zero because atoms make up everything, and he makes up his own rules."
  }
]
```

> **⚠️ Note:** This endpoint uses Claude API (Anthropic) which incurs costs per request. Please use responsibly and avoid excessive calls to prevent unexpected charges. Each request processes 10 jokes (5 Chuck + 5 Dad) and generates 5 AI-powered combinations. Consider implementing rate limiting or caching for production use. 💸

### Mathematical Operations

#### Calculate LCM
```http
GET /api/v1/math/lcm?numbers=12,18,24
```

Response:
```json
{
  "numbers": [12, 18, 24],
  "lcm": 72
}
```

#### Increment Number
```http
GET /api/v1/math/increment?number=42
```

Response:
```json
{
  "original": 42,
  "incremented": 43
}
```

## 📊 SQL Query Examples

The API supports SQL queries to filter jokes by user name and category name:

### Query 1: Get all jokes by user "Manolito"
```http
GET /api/v1/jokes?userName=manolito
```

### Query 2: Get all jokes from category "Humor negro"
```http
GET /api/v1/jokes?categoryName=humor%20negro
```

### Query 3: Get jokes from "Humor negro" by "Manolito"
```http
GET /api/v1/jokes?userName=manolito&categoryName=humor%20negro
```

### SQL Equivalents

These queries use Prisma's relational filtering, which translates to the following SQL:

**Query 1: Jokes by user name**
```sql
SELECT j.*
FROM jokes j
INNER JOIN users u ON j."userId" = u.id
WHERE u.name = 'manolito'
ORDER BY j."createdAt" DESC;
```

**Query 2: Jokes by category name**
```sql
SELECT j.*
FROM jokes j
INNER JOIN categories c ON j."categoryId" = c.id
WHERE c.name = 'humor negro'
ORDER BY j."createdAt" DESC;
```

**Query 3: Jokes by user and category names**
```sql
SELECT j.*
FROM jokes j
INNER JOIN users u ON j."userId" = u.id
INNER JOIN categories c ON j."categoryId" = c.id
WHERE u.name = 'manolito'
  AND c.name = 'humor negro'
ORDER BY j."createdAt" DESC;
```

## 🗄️ Database Seeding

The seed script creates:
- 4 users: `manolito`, `pepe`, `isabel`, `pedro`
- 3 categories: `humor negro`, `humor amarillo`, `chistes verdes`
- 36 jokes (3 per user per category)

```bash
pnpm run db:seed
```

## 🏗️ Project Structure

```
squadmaker-test/
├── src/
│   ├── contexts/                  # Bounded contexts (DDD)
│   │   ├── jokes/                # Jokes context
│   │   │   ├── domain/           # Entities, Value Objects, Repository interfaces
│   │   │   ├── application/      # Use Cases
│   │   │   └── infrastructure/   # Prisma, External APIs
│   │   ├── paired-jokes/         # AI-powered joke fusion
│   │   ├── math/                 # Mathematical operations
│   │   └── shared/               # Shared kernel
│   ├── shared/                   # Shared infrastructure
│   │   └── infrastructure/
│   │       ├── config/           # Environment config
│   │       ├── logger/           # Winston logger
│   │       └── http/             # Express server, routes, middlewares
│   └── index.ts                  # Application entry point
├── tests/
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   └── helpers/                  # Test utilities
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Database migrations
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI/CD
├── docker-compose.dev.yml        # Development environment
├── docker-compose.ci.yml         # CI environment
├── Dockerfile                    # Production image
└── package.json
```

## 🏛️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters) with **Domain-Driven Design** principles:

### Layers

1. **Domain Layer** (Core Business Logic)
   - Entities (Joke, PairedJoke)
   - Value Objects (JokeId, JokeText, UserId, CategoryId)
   - Repository Interfaces (Ports)
   - Pure TypeScript, no external dependencies

2. **Application Layer** (Use Cases)
   - CreateJoke, GetJoke, UpdateJoke, DeleteJoke
   - FetchExternalJoke, FetchPairedJokes
   - CalculateLCM, IncrementNumber
   - Orchestrates domain objects

3. **Infrastructure Layer** (Technical Details)
   - PrismaJokeRepository (Adapter)
   - ChuckNorrisApiService, DadJokesApiService, ClaudeApiService
   - HTTP Routes, Controllers, Middlewares
   - Database, Logging, External APIs

### Design Patterns
- Repository Pattern
- Dependency Injection
- Object Mother (for testing)
- Factory Pattern
- Error Handling with custom domain errors

## 🧪 Test-Driven Development (TDD)

Every feature was built following strict **Red-Green-Refactor** cycle:

1. **RED:** Write a failing test first
2. **GREEN:** Write minimal code to pass the test
3. **REFACTOR:** Improve code quality while keeping tests green

### Test Pyramid
- **Unit Tests (60%):** Fast, isolated, test single units
- **Integration Tests (25%):** Database, external services
- **E2E Tests (15%):** Full HTTP request/response cycle

### Coverage Thresholds
```json
{
  "branches": 85,
  "functions": 85,
  "lines": 85,
  "statements": 85
}
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The CI pipeline runs on every push and pull request:

1. **Lint & Unit Tests** (Fast feedback ~1-2 min)
   - ESLint code quality check
   - Unit tests execution
   - Parallel execution for speed

2. **Type Check & Build** (~1-2 min)
   - TypeScript compilation
   - Build verification

3. **Integration & E2E Tests** (~3-5 min)
   - Docker Compose environment
   - PostgreSQL database
   - Full test suite
   - Cleanup

4. **CI Success** (Summary)
   - All jobs must pass

### Deployment

Automatic deployment to Railway on push to `main`:
- Build Docker image
- Run database migrations
- Deploy to production
- Health check verification

## 🐳 Docker

### Development
```bash
pnpm run docker:dev:up         # Start with hot reload
pnpm run docker:dev:down       # Stop
pnpm run docker:dev:logs       # View logs
```

### CI/CD
```bash
pnpm run docker:ci:up          # Run full test suite
```

### Production
```bash
docker build -t squadmakers-api .
docker run -p 3000:3000 --env-file .env squadmakers-api
```

## 📝 Available Scripts

```bash
# Development
pnpm run dev                   # Start dev server with hot reload
pnpm run build                 # Build for production
pnpm start                     # Start production server

# Testing
pnpm test                      # Run all tests
pnpm run test:watch            # Watch mode
pnpm run test:coverage         # Coverage report
pnpm run test:unit             # Unit tests only
pnpm run test:integration      # Integration tests
pnpm run test:e2e             # E2E tests

# Code Quality
pnpm run lint                  # Run ESLint
pnpm run lint:fix              # Fix ESLint issues
pnpm run format                # Format with Prettier
pnpm run type-check            # TypeScript check

# Database
pnpm run db:migrate            # Run migrations
pnpm run db:seed               # Seed database
pnpm run db:studio             # Open Prisma Studio
pnpm run db:generate           # Generate Prisma Client

# Docker
pnpm run docker:dev:up         # Start dev environment
pnpm run docker:ci:up          # Run CI tests
```

## 🔒 Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
NODE_ENV=development|production
PORT=3000
LOG_LEVEL=debug|info|warn|error

# External APIs
CHUCK_NORRIS_API_URL=https://api.chucknorris.io
DAD_JOKES_API_URL=https://icanhazdadjoke.com

# Optional: AI Integration
ANTHROPIC_API_KEY=your-api-key
```

## 🚧 Future Improvements

While this project demonstrates production-ready architecture and best practices, here are some enhancements that could be implemented given more time:

### Performance & Scalability
- **Redis Caching Layer**
  - Cache frequently accessed jokes and external API responses
  - Reduce database load and improve response times
  - Implement cache invalidation strategies
  - Example: Cache Chuck Norris and Dad Jokes for 1 hour

- **Database Optimization**
  - Add database indexes on frequently queried fields (userName, categoryName)
  - Implement database connection pooling optimization
  - Add read replicas for high-traffic scenarios
  - Query performance monitoring and optimization

- **API Rate Limiting Per User**
  - Implement user-specific rate limiting (currently global)
  - Add API key authentication for better control
  - Track usage per client/API key

### Features
- **Pagination & Filtering**
  - Add pagination to `GET /api/v1/jokes` (limit, offset, cursor-based)
  - Advanced filtering (date ranges, text search, popularity)
  - Sorting options (createdAt, updatedAt, likes)

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Users can only modify their own jokes

- **Joke Reactions & Analytics**
  - Like/dislike system
  - View count tracking
  - Popular jokes endpoint
  - User activity analytics

- **Advanced AI Features**
  - Joke sentiment analysis
  - Automatic joke categorization
  - Joke quality scoring
  - Personalized joke recommendations

### Monitoring & Observability
- **APM Integration**
  - New Relic, DataDog, or Sentry for error tracking
  - Performance monitoring and alerting
  - Custom metrics and dashboards

- **Structured Logging**
  - Enhanced Winston configuration with log aggregation
  - Request tracing with correlation IDs
  - Log levels per environment

- **Health Checks Enhancement**
  - Database connectivity check
  - External API availability check
  - Disk space and memory monitoring

### Testing & Quality
- **Load Testing**
  - Artillery or k6 for performance testing
  - Identify bottlenecks under high load
  - Set performance baselines (SLAs/SLOs)

- **Contract Testing**
  - Pact for consumer-driven contracts
  - Ensure API compatibility across versions

- **Mutation Testing**
  - Stryker for test quality validation
  - Identify gaps in test coverage

### DevOps & Infrastructure
- **Multi-Region Deployment**
  - Deploy to multiple regions for lower latency
  - Geographic load balancing

- **Kubernetes Orchestration**
  - Migrate from Railway to K8s for better control
  - Auto-scaling based on traffic
  - Zero-downtime deployments

- **Infrastructure as Code**
  - Terraform or Pulumi for infrastructure provisioning
  - Version-controlled infrastructure changes

### Security
- **Security Headers**
  - Enhanced Helmet.js configuration
  - CORS fine-tuning per environment
  - Content Security Policy (CSP)

- **Input Sanitization**
  - Enhanced XSS and SQL injection prevention
  - Request validation middleware

- **Secrets Management**
  - HashiCorp Vault or AWS Secrets Manager
  - Automatic secret rotation

### Documentation
- **Postman Collection**
  - Pre-configured requests for easy testing
  - Environment variables setup

- **Architecture Diagrams**
  - C4 model diagrams
  - Sequence diagrams for complex flows
  - ER diagrams for database schema

### Cost Optimization
- **Claude API Caching**
  - Cache AI-generated joke combinations
  - Reduce API calls and costs
  - Implement cache warming strategies

- **Serverless Migration for Low-Traffic Endpoints**
  - Move infrequent endpoints to AWS Lambda or similar
  - Pay only for actual usage

Most of these improvements were intentionally skipped to focus on demonstrating:
- Clean architecture principles
- Test-driven development
- Production deployment
- CI/CD implementation

The current implementation prioritizes **code quality**, **testability**, and **maintainability** over feature completeness.

## 🤝 Contributing

This is a technical challenge project. Contributions are not expected, but the codebase demonstrates:

- Clean code principles
- SOLID principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Separation of concerns
- Dependency inversion

## 📄 License

MIT

## 👨‍💻 Author

**Cristian Del Rio**

Built as a technical challenge to demonstrate:
- Advanced Node.js/TypeScript development
- Hexagonal Architecture implementation
- Test-Driven Development (TDD)
- CI/CD best practices
- Production-ready deployment
- AI integration capabilities

---

**⭐ If you found this project helpful, please consider giving it a star!**
