# Flocksy AI - Comprehensive Testing Guide

## Overview

This document provides detailed testing procedures for all components of the Flocksy AI platform, including unit tests, integration tests, end-to-end tests, and manual verification steps.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Testing Environment Setup](#testing-environment-setup)
3. [Backend Testing](#backend-testing)
4. [AI Core Testing](#ai-core-testing)
5. [MCP Services Testing](#mcp-services-testing)
6. [Frontend Testing](#frontend-testing)
7. [ML Pipeline Testing](#ml-pipeline-testing)
8. [RAG System Testing](#rag-system-testing)
9. [Integration Testing](#integration-testing)
10. [End-to-End Testing](#end-to-end-testing)
11. [Performance Testing](#performance-testing)
12. [Security Testing](#security-testing)

---

## Prerequisites

### Required Tools

- **Node.js**: v18.18.0 or higher
- **Python**: 3.9 or higher
- **PostgreSQL**: 14 or higher
- **Redis**: 6 or higher (optional, for async jobs)
- **Docker**: Latest version (optional, for containerized testing)

### Environment Variables

Ensure all `.env` files are properly configured:

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/flocksy
JWT_SECRET=your-jwt-secret
AI_CORE_URL=http://localhost:8000

# AI Core (.env)
OPENAI_API_KEY=your-openai-key
MCP_DISEASE_URL=http://localhost:8101
MCP_MEDICINE_URL=http://localhost:8102
MCP_FEED_URL=http://localhost:8103
MCP_ENVIRONMENT_URL=http://localhost:8104
MCP_SAFETY_URL=http://localhost:8105
MCP_MEMORY_URL=http://localhost:8106
```

---

## Testing Environment Setup

### Step 1: Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# AI Core dependencies
cd ../ai-core
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# MCP Services dependencies
cd ../mcp-services
for dir in *_mcp; do
  cd "$dir"
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  deactivate
  cd ..
done
```

### Step 2: Setup Test Database

```bash
# Create test database
createdb flocksy_test

# Run migrations (if available)
cd backend
npm run db:migrate:test
```

### Step 3: Verify All Services

```bash
# Run the startup script
./start-all.sh

# Verify services are running
curl http://localhost:8080/health    # Backend
curl http://localhost:8000/health    # AI Core
curl http://localhost:8101/health    # Disease MCP
curl http://localhost:8102/health    # Medicine MCP
curl http://localhost:8103/health    # Feed MCP
curl http://localhost:8104/health    # Environment MCP
curl http://localhost:8105/health    # Safety MCP
curl http://localhost:8106/health    # Memory MCP
```

---

## Backend Testing

### Unit Tests

Backend uses TypeScript with Express. Testing framework: **Jest** or **Vitest**.

#### Setup Test Framework

```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
```

#### Test Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── __tests__/
│   │   │   ├── auth.test.ts
│   │   │   ├── diagnosis.test.ts
│   │   │   ├── farms.test.ts
│   │   │   └── dashboard.test.ts
│   ├── services/
│   │   ├── __tests__/
│   │   │   ├── authService.test.ts
│   │   │   └── aiCoreClient.test.ts
│   └── middleware/
│       └── __tests__/
│           └── auth.test.ts
```

#### Example Test: Auth Routes

```typescript
// src/routes/__tests__/auth.test.ts
import request from 'supertest';
import app from '../../app';

describe('Auth Routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
          name: 'Login User'
        });

      // Then login
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
```

#### Run Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- auth.test.ts

# Run in watch mode
npm test -- --watch
```

