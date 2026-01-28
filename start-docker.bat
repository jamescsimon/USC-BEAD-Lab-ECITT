@echo off
REM ECITT iPad Project - Start Docker Services

echo Starting ECITT Docker services...
docker-compose up -d

echo.
echo Services starting up...
echo.
echo Backend: http://localhost:3000
echo PostgreSQL: localhost:5432
echo.
echo Waiting for services to be healthy...
timeout /t 5 /nobreak

REM Check backend health
curl -f http://localhost:3000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo Backend is ready
) else (
    echo Warning: Backend is still starting up, check logs with: docker-compose logs -f backend
)

echo.
echo View logs: docker-compose logs -f
echo Stop services: docker-compose down
