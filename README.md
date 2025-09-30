# Event Management Application

A modern, full-stack event management system built with TypeScript, featuring a React frontend and Fastify backend, designed for organizing and tracking events with real-time notifications.

## 🚀 Features

### Core Functionality

- **Event Management**: Create, update, duplicate, and archive events
- **Event Status Workflow**: Draft → Published → Archived lifecycle management
- **Advanced Filtering**: Search events by name, tags, or status
- **Pagination**: Efficient handling of large event lists
- **Real-time Notifications**: Track event updates with notification badges
- **Quick Actions**: Inline event operations for improved UX

### Technical Highlights

- **Type-Safe API**: OpenAPI specification with auto-generated TypeScript types
- **Database Migrations**: Managed with Drizzle ORM
- **Monorepo Architecture**: PNPM workspace for efficient dependency management
- **Modern UI Components**: Built with Radix UI and Tailwind CSS
- **State Management**: React Query for server state and Zustand for client state

## 📁 Project Structure

```
event_management_app/
├── backend/           # Fastify backend server
│   ├── src/
│   │   ├── app.ts          # Application setup
│   │   ├── server.ts       # Server entry point
│   │   ├── db/             # Database schema and migrations
│   │   ├── routes/         # API route definitions and handlers
│   │   ├── services/       # Business logic layer
│   │   ├── repositories/   # Data access layer
│   │   └── plugins/        # Fastify plugins
│   └── tests/              # Backend tests
├── frontend/          # React application
│   ├── src/
│   │   ├── main.tsx        # Application entry
│   │   ├── routes/         # React Router setup
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   ├── apis/           # API client layer
│   │   └── hooks/          # Custom React hooks
│   └── dist/               # Production build
├── openapi/           # API specification
│   ├── openapi_spec.yaml   # OpenAPI 3.1 specification
│   └── generated-types.d.ts # Auto-generated TypeScript types
├── api/               # Vercel serverless function
├── docker/            # Docker configuration
├── e2b/               # E2B sandbox environment
└── scripts/           # Build and utility scripts
```

## 🛠️ Tech Stack

### Backend

- **Framework**: Fastify 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful API based on OpenAPI 3.1 specification
- **Validation**: Zod schemas
- **Logging**: Pino

### Frontend

- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State Management**: React Query + Zustand
- **API Client**: openapi-fetch with type safety
- **Build Tool**: Vite

### Infrastructure

- **Package Manager**: PNPM with workspaces
- **Testing**: Vitest for both frontend and backend
- **Deployment**: Vercel (frontend) / Docker (backend)
- **Development Environment**: E2B sandbox support

## 🚦 Getting Started

### Prerequisites

- Node.js >= 22.17.1
- PNPM ~10.14.0
- PostgreSQL (for local development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd event_management_app
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

4. Run database migrations:

```bash
cd backend
pnpm db:migrate
```

### Development

Start the development servers:

```bash
# Start backend (port 3001)
cd backend
pnpm dev

# In another terminal, start frontend (port 5173)
cd frontend
pnpm dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/v1

## 🎯 API Route Architecture

**This project uses manual route definitions based on the OpenAPI specification.**

### How It Works:

1. **All business API routes are defined in:** `backend/src/routes/`
2. **Routes are manually implemented** following the OpenAPI specification
3. **Route files** for business endpoints (events, etc.) in `backend/src/routes/`
4. **Handler implementation:** Directly in route files using services

### Key Points:

- ✅ **DO:** Define new endpoints in route files under `backend/src/routes/`
- ✅ **DO:** Follow the OpenAPI specification for consistency
- ✅ **DO:** Use services for business logic implementation
- ✅ **DO:** Keep route handlers focused on request/response handling

### Benefits:

- Direct control over route definitions
- Clear separation of concerns
- Type-safe client and server code
- Simplified debugging and maintenance

## 📝 API Documentation

The API follows OpenAPI 3.1 specification. Key endpoints include:

- `GET /api/v1/events` - List events with pagination and filters
- `GET /api/v1/events/{id}` - Get event details
- `PUT /api/v1/events/{id}` - Update event
- `DELETE /api/v1/events/{id}` - Archive or delete event
- `POST /api/v1/events/{id}/duplicate` - Duplicate an event
- `POST /api/v1/events/{id}/cancel` - Cancel event or occurrence
- `POST /api/v1/events/{id}/quick-actions` - Perform quick actions

## 🧪 Testing

Run tests for all workspaces:

```bash
pnpm test
```

Run tests with coverage:

```bash
cd backend
pnpm coverage
```

## 🏗️ Building for Production

Build all workspaces:

```bash
pnpm build
```

This creates:

- `backend/dist/` - Compiled backend code
- `frontend/dist/` - Production-ready frontend assets

## 🐳 Docker Deployment

Build and run with Docker:

```bash
docker build -f docker/Dockerfile -t event-management-app .
docker run -p 3001:3001 event-management-app
```

## 🚀 Deployment

### Vercel Deployment

The application is configured for Vercel deployment with:

- Frontend static hosting
- Backend as serverless functions
- Automatic deployments from main branch

### E2B Sandbox

For development in E2B sandbox environment:

```bash
cd e2b
./start.sh
```

## 📚 Development Workflow

### Adding New API Endpoints

1. **Create Route File**: Add a new route file in `backend/src/routes/`
   - Define your endpoints with proper HTTP methods
   - Implement handlers using services
2. **Export Route**: Export the route from `backend/src/routes/index.ts`
3. **Register Route**: Import and register in `backend/src/app.ts`
   - Use the API_PREFIX constant for consistency
4. **Generate Types**: Run `pnpm --filter @app/openapi generate-types`
   - This creates TypeScript types for the frontend
5. **Update Frontend**: Use generated types in React components
   - Import from `@app/openapi/generated-types`
   - Use the type-safe API client
6. **Test**: Write tests for new features
7. **Validate**: Run `pnpm validate` for preflight checks

## 🔧 Scripts

### Root Level

- `pnpm build` - Build all workspaces
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm typecheck` - Type check all TypeScript

### Backend

- `pnpm dev` - Start development server
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations

### Frontend

- `pnpm dev` - Start development server
- `pnpm build` - Build for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
