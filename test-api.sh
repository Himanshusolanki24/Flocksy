#!/bin/bash

# Flocksy API Integration Test Script
# This script tests all backend endpoints

BASE_URL="http://localhost:8080/api/v1"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Flocksy API Integration Test"
echo "======================================"
echo ""

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ Health check failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi
echo ""

# Test 2: Register User
echo -e "${YELLOW}Test 2: Register User${NC}"
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@flocksy.com",
    "password": "test123456",
    "role": "farmer"
  }')
HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Registration failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi
echo ""

# Test 3: Login
echo -e "${YELLOW}Test 3: Login${NC}"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@flocksy.com",
    "password": "test123456"
  }')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
    echo "Trying to continue with existing token..."
fi
echo ""

# Test 4: Dashboard Summary (requires auth)
echo -e "${YELLOW}Test 4: Dashboard Summary${NC}"
if [ -n "$TOKEN" ]; then
    DASHBOARD_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/dashboard/summary" \
      -H "Authorization: Bearer $TOKEN")
    HTTP_CODE=$(echo "$DASHBOARD_RESPONSE" | tail -n1)
    BODY=$(echo "$DASHBOARD_RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Dashboard data retrieved${NC}"
        echo "Response preview: ${BODY:0:200}..."
    else
        echo -e "${RED}✗ Dashboard request failed (HTTP $HTTP_CODE)${NC}"
        echo "Response: $BODY"
    fi
else
    echo -e "${RED}✗ Skipped (no auth token)${NC}"
fi
echo ""

# Test 5: List Vets (requires auth)
echo -e "${YELLOW}Test 5: List Veterinarians${NC}"
if [ -n "$TOKEN" ]; then
    VETS_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/vets" \
      -H "Authorization: Bearer $TOKEN")
    HTTP_CODE=$(echo "$VETS_RESPONSE" | tail -n1)
    BODY=$(echo "$VETS_RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Vets list retrieved${NC}"
        echo "Response: $BODY"
    else
        echo -e "${RED}✗ Vets request failed (HTTP $HTTP_CODE)${NC}"
        echo "Response: $BODY"
    fi
else
    echo -e "${RED}✗ Skipped (no auth token)${NC}"
fi
echo ""

# Test 6: Chat Query
echo -e "${YELLOW}Test 6: Chat Query${NC}"
CHAT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/diagnosis/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the vaccination schedule for broiler chickens?",
    "farmId": "farm-demo-1"
  }')
HTTP_CODE=$(echo "$CHAT_RESPONSE" | tail -n1)
BODY=$(echo "$CHAT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Chat query successful${NC}"
    echo "Response preview: ${BODY:0:200}..."
else
    echo -e "${RED}✗ Chat query failed (HTTP $HTTP_CODE)${NC}"
    echo "Response: $BODY"
fi
echo ""

echo "======================================"
echo "Test Summary"
echo "======================================"
echo "All tests completed. Check results above."
echo ""
echo "Next steps:"
echo "1. Start frontend: cd 'Flocksy/frontend ' && npm run dev"
echo "2. Open browser: http://localhost:5173"
echo "3. Test the UI integration"
