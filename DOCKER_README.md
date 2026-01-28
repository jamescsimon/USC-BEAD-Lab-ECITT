# ECITT iPad Project - Docker Setup Guide

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose v1.29+

### Start the services

```bash
cd ecitt-ipad-project

# Start all services (PostgreSQL + Backend)
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Stop the services

```bash
docker-compose down

# To remove volumes (database data)
docker-compose down -v
```

## Services

### PostgreSQL (postgres)
- **Host**: localhost
- **Port**: 5432
- **Database**: ecitt_db
- **User**: ecitt_user
- **Password**: ecitt_password

Database schema is automatically initialized from `database/schema.sql`

### Backend API (backend)
- **URL**: http://localhost:3000
- **Health Check**: GET http://localhost:3000/health

## Development

### View backend logs
```bash
docker-compose logs -f backend
```

### Restart backend
```bash
docker-compose restart backend
```

### Access database shell
```bash
docker-compose exec postgres psql -U ecitt_user -d ecitt_db
```

### Useful PostgreSQL queries
```sql
-- List tables
\dt

-- Describe table
\d sessions

-- Query data
SELECT * FROM sessions;
```

## iPad App Development

The iPad app runs locally on your machine (not in Docker):

```bash
cd ipad-app
npm install
npm start

# Then in the Expo app, connect to:
# http://192.168.X.X:3000 (your laptop's IP address)
```

Update the API_URL in `ipad-app/app/services/NetworkService.js` to match your laptop's IP.
