#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 Setting up environment variables...${NC}"

# Check if .env already exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists. Skipping...${NC}"
    exit 0
fi

# Copy from template
if [ -f env.example ]; then
    cp env.example .env
    echo -e "${GREEN}✅ Created .env file from template${NC}"
else
    echo -e "${YELLOW}❌ env.example not found. Creating basic .env file...${NC}"
    cat > .env << EOF
# Database Configuration
MIGRILLA_DB_HOST=localhost
MIGRILLA_DB_PORT=5432
MIGRILLA_DB_NAME=test_migrilla
MIGRILLA_DB_USER=postgres
MIGRILLA_DB_PASSWORD=postgres

# Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ Created basic .env file${NC}"
fi

echo -e "${GREEN}🎉 Environment setup complete!${NC}"
echo -e "${YELLOW}💡 You can now run:${NC}"
echo -e "   npm run docker:up    # Start PostgreSQL"
echo -e "   npm test             # Run tests" 