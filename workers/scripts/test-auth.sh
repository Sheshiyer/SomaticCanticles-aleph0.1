#!/bin/bash
# Test script for Authentication Endpoints
# Usage: ./scripts/test-auth.sh [base_url]

BASE_URL="${1:-http://localhost:8787/api/v1}"

echo "========================================"
echo "Somatic-Canticles Auth API Test Suite"
echo "Base URL: $BASE_URL"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5
    
    echo "Testing: $name"
    echo "  $method $endpoint"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "  ${GREEN}✓ Passed${NC} (HTTP $status_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}✗ Failed${NC} (Expected HTTP $expected_status, got HTTP $status_code)"
        echo "  Response: $body"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
}

# Health check
echo "1. Health Check"
echo "---------------"
test_endpoint "Health Check" "GET" "/health" "" "200"

# Login tests
echo "2. Login Endpoint"
echo "-----------------"
test_endpoint "Login with valid credentials" "POST" "/auth/login" \
    '{"email":"test@example.com","password":"TestUser13!"}' "200"

test_endpoint "Login with invalid credentials" "POST" "/auth/login" \
    '{"email":"test@example.com","password":"wrongpassword"}' "401"

test_endpoint "Login with missing fields" "POST" "/auth/login" \
    '{"email":"test@example.com"}' "400"

# Register tests
echo "3. Register Endpoint"
echo "--------------------"
test_endpoint "Register with existing email" "POST" "/auth/register" \
    '{"email":"test@example.com","password":"NewPass123!"}' "409"

test_endpoint "Register with weak password" "POST" "/auth/register" \
    '{"email":"new@example.com","password":"weak"}' "400"

# Refresh token test
echo "4. Refresh Token Endpoint"
echo "-------------------------"
test_endpoint "Refresh with invalid token" "POST" "/auth/refresh" \
    '{"refreshToken":"invalid_token"}' "401"

# Logout test
echo "5. Logout Endpoint"
echo "------------------"
test_endpoint "Logout" "POST" "/auth/logout" \
    '{"refreshToken":"dummy_token"}' "200"

# Protected endpoints
echo "6. Protected Endpoints"
echo "----------------------"
test_endpoint "Get me without auth" "GET" "/auth/me" "" "401"
test_endpoint "Update profile without auth" "PUT" "/auth/me" \
    '{"timezone":"UTC"}' "401"
test_endpoint "Logout all without auth" "POST" "/auth/logout-all" "" "401"
test_endpoint "Change password without auth" "POST" "/auth/change-password" \
    '{"currentPassword":"old","newPassword":"NewPass123!"}' "401"

# Forgot password
echo "7. Password Reset"
echo "-----------------"
test_endpoint "Forgot password with valid email" "POST" "/auth/forgot-password" \
    '{"email":"test@example.com"}' "200"

test_endpoint "Forgot password with invalid email" "POST" "/auth/forgot-password" \
    '{"email":"notanemail"}' "400"

# Summary
echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
