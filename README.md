# Bot2Do Assignment

This repo is an assignment for Bot2Do.

## Tech Stack

### Frontend
- React 19
- TypeScript
- TailwindCSS
- React Hook Form
- Zod
- Lucide React (Icons)

### Backend
- NestJS
- MongoDB
- Redis
- Mailhog (for email testing)

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher)
- npm or yarn

## Project Structure

```
.
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
└── docker-compose.yaml
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:Shobhit-Nagpal/bot2do-assignment.git
cd bot2do-assignment
```

### 2. Environment Setup

#### Backend (.env)
Create a `.env` file in `apps/api/` with the following variables or as given in `.env.example` :

```env
DATABASE_URL=mongodb://db:27017/testdb?replicaSet=rs0
REDIS_HOST=redis
REDIS_PORT=6379
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=user
SMTP_PASS=password
SMTP_FROM=noreply@securescale.com
FRONTEND_URL=http://localhost:8080
JWT_SECRET=x9hhZWWl9GhJOFuotRiV81j5iHRo/T8tgMM8Q4mvdmg=
```

#### Frontend (.env)
Create a `.env` file in `apps/web/` with:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Start the Application

#### Using Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Mailhog (Email Testing): http://localhost:8025

PS: Had a ton of fun working on this assignment. Been wanting to try out this flow along with Redis and Mailhog. Thank you!