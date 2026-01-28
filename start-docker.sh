#!/bin/bash

# ECITT iPad Project - Start Docker Services

echo "Starting ECITT Docker services..."
docker-compose up -d

echo ""
echo "✓ Services starting up..."
echo ""
echo "Backend: http://localhost:3000"
echo "PostgreSQL: localhost:5432"
echo ""
echo "Waiting for services to be healthy..."
sleep 5

# Check backend health
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ Backend is ready"
else
    echo "⚠ Backend is still starting up, check logs with: docker-compose logs -f backend"
fi

# Check database connection
if docker-compose exec -T postgres pg_isready -U ecitt_user > /dev/null 2>&1; then
    echo "✓ Database is ready"
else
    echo "⚠ Database is still starting up, check logs with: docker-compose logs -f postgres"
fi

echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
