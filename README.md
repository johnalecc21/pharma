# Pharma Management System

A full-stack pharmacy management application built with:
- **Backend**: NestJS + TypeScript + PostgreSQL
- **Frontend**: Angular + TypeScript + SCSS

## Project Structure

```
pharma/
├── backend/     # NestJS REST API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication & authorization
│   │   │   ├── medicamentos/  # Medication management
│   │   │   ├── usuarios/      # User management
│   │   │   ├── ventas/        # Sales management
│   │   │   └── dashboard/     # Dashboard data
│   │   ├── common/            # Shared utilities
│   │   ├── config/            # App configuration
│   │   └── database/          # Database setup
│   └── docker-compose.yml     # PostgreSQL via Docker
└── frontend/    # Angular SPA
    └── src/
        └── app/
            ├── core/          # Guards, interceptors, services
            ├── features/      # Feature modules
            ├── layout/        # App layout components
            └── shared/        # Shared components & pipes
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm

### Backend

```bash
cd backend
cp .env.example .env   # Configure your environment variables
docker-compose up -d   # Start PostgreSQL
npm install
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Usuarios de prueba

| Email | Contraseña | Rol |
| admin@pharmadash.com | password123 | ADMINISTRADOR |
| farmaceutico@pharmadash.com | password123 | FARMACÉUTICO |

## Branches
- `main` 

