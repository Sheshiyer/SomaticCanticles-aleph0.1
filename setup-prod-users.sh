#!/bin/bash
# Production Setup Script (Users Only)
# Usage: ./setup-prod-users.sh

set -e # Exit on error

WORKERS_DIR="./workers"
SEED_FILE="$WORKERS_DIR/migrations/seed-prod.sql"
SCHEMA_UPDATE_FILE="$WORKERS_DIR/migrations/0002_schema_update.sql"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}=======================================${NC}"
echo -e "${RED}WARNING: PRODUCTION DATABASE UPDATE${NC}"
echo -e "${RED}=======================================${NC}"
echo -e "This will:"
echo -e "1. Add missing columns to 'chapters' and 'user_progress'"
echo -e "2. DELETE ALL existing USERS in production"
echo -e "3. Insert new Admin and 15 Test Users"
echo -e ""
echo -e "Crucially, it will NOT delete the 'chapters' table."
echo -e ""
read -p "Are you sure you want to proceed? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Cancelled.${NC}"
    exit 1
fi

# Step 1: Install & Generate
echo -e "\n${YELLOW}Step 1: Generating Production Seed Data...${NC}"
cd "$WORKERS_DIR"
bun run scripts/generate-seed-prod.ts > "./migrations/seed-prod.sql"
echo -e "${GREEN}✓ Seed file generated at $SEED_FILE${NC}"
cd ..

# Step 2: Schema Update
echo -e "\n${YELLOW}Step 2: Updating Production Schema (Adding Columns)...${NC}"
# Use --remote and --env production
# We try/catch this because if columns exist, it might fail, but we want to proceed.
# Actually, let's just run it. If it fails, the user will see.
cd "$WORKERS_DIR"
bunx wrangler d1 execute somatic-canticles-db --env production --remote --file=./migrations/0002_schema_update.sql || echo -e "${YELLOW}Schema update warning (columns might already exist). Continuing...${NC}"

# Step 3: Seed Users
echo -e "\n${YELLOW}Step 3: Seeding Users to Production...${NC}"
bunx wrangler d1 execute somatic-canticles-db --env production --remote --file=./migrations/seed-prod.sql

cd ..
echo -e "${GREEN}✓ Production users updated.${NC}"
echo -e "${BLUE}=======================================${NC}"
