#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 Starting Migrilla test environment with Docker...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Stop and remove existing containers
echo -e "${YELLOW}🔄 Cleaning up existing containers...${NC}"
docker-compose down -v 2>/dev/null || true

# Start PostgreSQL
echo -e "${YELLOW}🚀 Starting PostgreSQL container...${NC}"
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
until docker-compose exec -T postgres pg_isready -U postgres -d test_migrilla > /dev/null 2>&1; do
    sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp env.example .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm test

# Show status
echo -e "${YELLOW}📊 Migration status:${NC}"
node bin/migrilla.js status

echo -e "${GREEN}🎉 Test environment is ready!${NC}"
echo -e "${YELLOW}💡 Useful commands:${NC}"
echo -e "   docker-compose up -d          # Start all services"
echo -e "   docker-compose down           # Stop all services"
echo -e "   docker-compose logs postgres  # View PostgreSQL logs"
echo -e "   npm test                      # Run tests"
echo -e "   node bin/migrilla.js up       # Apply migrations"
echo -e "   node bin/migrilla.js down     # Rollback last migration"
echo -e "   node bin/migrilla.js status  # Check migration status" 