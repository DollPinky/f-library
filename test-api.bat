@echo off
echo ========================================
echo Testing Library Management API
echo ========================================

echo.
echo 1. Testing Health Check...
curl -X GET http://localhost:8080/api/health

echo.
echo 2. Testing Ping...
curl -X GET http://localhost:8080/api/health/ping

echo.
echo 3. Testing Application Info...
curl -X GET http://localhost:8080/api/health/info

echo.
echo ========================================
echo API Testing Complete!
echo ========================================
echo.
echo Access Swagger UI: http://localhost:8080/swagger-ui.html
echo Access Health Check: http://localhost:8080/api/health
echo.
pause 