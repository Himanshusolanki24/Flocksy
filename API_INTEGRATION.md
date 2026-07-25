# Flocksy API Integration Guide

## Overview

This document describes the complete API integration between the Flocksy frontend (React + Vite) and backend (Node.js + Express + TypeScript).

## Backend Server

**Base URL**: `http://localhost:8080/api/v1`

### Starting the Backend

```bash
cd Flocksy/backend
npm install
npm run dev
```

The backend will start on port 8080.

## Frontend Configuration

### Environment Variables

Create `.env.local` in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Starting the Frontend

```bash
cd "Flocksy/frontend "
npm install
npm run dev
```

The frontend will start on port 5173.

## API Endpoints

### 1. Authentication (`/auth`)

#### POST `/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "farmer"
  }
}
```

#### POST `/auth/register`
Register a new user.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "farmer"
}
```

**Response**:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "farmer"
  }
}
```

### 2. Dashboard (`/dashboard`)

#### GET `/dashboard/summary`
Get comprehensive dashboard data.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "activeAlerts": 3,
  "healthyBirdRatio": 91.4,
  "feedEfficiency": 87.9,
  "pendingTreatments": 5,
  "recentDetections": [
    {
      "disease": "Coccidiosis",
      "confidence": 0.82,
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ],
  "stats": [
    {
      "label": "Active Flocks",
      "value": "12",
      "subtext": "+2 this week",
      "trend": "up"
    }
  ],
  "alerts": [
    {
      "id": "alert-1",
      "title": "Temperature Alert - Coop 3",
      "badge": "Critical",
      "note": "Temperature above threshold",
      "severity": "critical",
      "timestamp": "2025-01-15T10:30:00Z",
      "actionRequired": true,
      "category": "environment"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Check vaccination schedule",
      "priority": "high",
      "completed": false,
      "category": "health",
      "dueDate": "2025-01-16T10:00:00Z"
    }
  ],
  "weeklyTrend": [
    { "day": "Mon", "value": 85 },
    { "day": "Tue", "value": 88 }
  ],
  "activities": [
    {
      "id": "activity-1",
      "title": "Health check completed",
      "meta": "Coop 1",
      "timestamp": "2025-01-15T09:00:00Z",
      "type": "note"
    }
  ],
  "chartData": [
    {
      "label": "Feed",
      "value": 45,
      "color": "#3b82f6",
      "description": "Feed costs and efficiency"
    }
  ]
}
```

### 3. Diagnosis (`/diagnosis`)

#### POST `/diagnosis/upload`
Upload an image for disease diagnosis.

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data**:
- `media`: Image file (JPEG, PNG)
- `symptoms`: Text description
- `farmId`: Farm identifier
- `batchId`: Batch identifier (optional)
- `flockSize`: Number of birds (optional)
- `ageInDays`: Age in days (optional)
- `temperatureC`: Temperature in Celsius (optional)
- `humidityPercent`: Humidity percentage (optional)
- `feedType`: Type of feed (optional)

**Response**:
```json
{
  "requestId": "uuid",
  "media": {
    "url": "https://storage.example.com/image.jpg",
    "mimeType": "image/jpeg"
  },
  "analysis": {
    "result": {
      "disease": {
        "prediction": "Coccidiosis",
        "confidence": 0.85
      },
      "next_steps": [
        "Isolate affected birds",
        "Consult veterinarian"
      ],
      "warnings": [
        "Monitor closely for 48 hours"
      ]
    }
  }
}
```

#### POST `/diagnosis/analyze`
Same as `/diagnosis/upload` - analyze with symptoms and optional image.

#### POST `/diagnosis/chat`
Send a text query to the AI assistant.

**Request Body**:
```json
{
  "query": "What should I do if my chickens have yellow spots?",
  "farmId": "farm-demo-1"
}
```

**Response**:
```json
{
  "advice": "Based on the symptoms, a possible condition is **Coccidiosis**...",
  "analysis": {
    "result": {
      "disease": {
        "prediction": "Coccidiosis"
      },
      "next_steps": ["..."],
      "warnings": ["..."]
    }
  }
}
```

### 4. Veterinarians (`/vets`)

#### GET `/vets`
List all available veterinarians.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "items": [
    {
      "id": "vet-1",
      "name": "Dr. Ananya Kulkarni",
      "specialty": "Poultry pathology",
      "city": "Pune",
      "availability": "Within 4 hours"
    }
  ]
}
```

#### GET `/vets/:id`
Get details of a specific veterinarian.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": "vet-1",
  "name": "Dr. Ananya Kulkarni",
  "specialty": "Poultry pathology",
  "city": "Pune",
  "availability": "Within 4 hours"
}
```

### 5. Users (`/users`)

#### GET `/users/profile`
Get current user profile.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "role": "farmer",
  "name": "John Doe",
  "farmName": "Green Valley Farm"
}
```

### 6. Health Check (`/health`)

#### GET `/health`
Check if the backend is running.

**Response**:
```json
{
  "service": "focksy-backend",
  "status": "ok"
}
```

## Frontend API Usage

### Import API Functions

```javascript
import { 
  authApi, 
  dashboardApi, 
  diagnosisApi, 
  vetApi,
  farmApi,
  userApi,
  healthApi 
} from './src/api';
```

### Example: Login

```javascript
try {
  const result = await authApi.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  localStorage.setItem('token', result.token);
  console.log('Logged in:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Example: Fetch Dashboard

```javascript
try {
  const summary = await dashboardApi.getSummary();
  console.log('Dashboard data:', summary);
} catch (error) {
  console.error('Failed to fetch dashboard:', error.message);
}
```

### Example: Upload Image for Diagnosis

```javascript
const formData = new FormData();
formData.append('media', imageFile);
formData.append('symptoms', 'Yellow spots on leaves');
formData.append('farmId', 'farm-123');
formData.append('flockSize', '500');

try {
  const result = await diagnosisApi.uploadImage(formData);
  console.log('Analysis:', result.analysis);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

### Example: Chat Query

```javascript
try {
  const result = await diagnosisApi.sendChatQuery(
    'What is the vaccination schedule for broiler chickens?',
    'farm-demo-1'
  );
  console.log('AI Response:', result.advice);
} catch (error) {
  console.error('Chat failed:', error.message);
}
```

## Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns JWT token
3. Frontend stores token in `localStorage`
4. All subsequent requests include token in `Authorization` header
5. Backend validates token using middleware

## Error Handling

All API errors return this format:

```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error

## CORS Configuration

The backend allows requests from all origins in development. For production, update the CORS configuration in `backend/src/app.ts`.

## Database

The backend uses PostgreSQL (Supabase) for data storage. Connection string is in `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@host:5432/database
```

## Redis Cache

Redis is used for caching and session management:

```env
REDIS_URL=redis://default:password@host:port
```

## AI Core Integration

The backend connects to the AI Core service for disease analysis:

```env
AI_CORE_URL=http://127.0.0.1:8000
```

Make sure the AI Core service is running before using diagnosis features.

## Testing the Integration

### 1. Start Backend
```bash
cd Flocksy/backend
npm run dev
```

### 2. Start Frontend
```bash
cd "Flocksy/frontend "
npm run dev
```

### 3. Test Health Check
```bash
curl http://localhost:8080/api/v1/health
```

### 4. Test Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 5. Open Frontend
Navigate to `http://localhost:5173` in your browser.

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 8080
- Check CORS configuration in `backend/src/app.ts`
- Verify `VITE_API_BASE_URL` in frontend `.env.local`

### Authentication Errors
- Check if token is stored in localStorage
- Verify token format: `Bearer <token>`
- Ensure JWT_SECRET is set in backend `.env`

### Connection Errors
- Verify backend is running: `curl http://localhost:8080/api/v1/health`
- Check network tab in browser DevTools
- Ensure no firewall blocking ports 8080 or 5173

### Database Errors
- Verify DATABASE_URL in backend `.env`
- Check Supabase connection
- Run database migrations if needed

## Next Steps

1. ✅ Backend endpoints configured
2. ✅ Frontend API client updated
3. ✅ Dashboard store integrated
4. ✅ Environment variables set
5. ⏳ Test all endpoints
6. ⏳ Add error boundaries in frontend
7. ⏳ Implement loading states
8. ⏳ Add toast notifications for errors

## Support

For issues or questions, check:
- Backend logs: `Flocksy/backend` terminal
- Frontend console: Browser DevTools
- Network requests: Browser DevTools Network tab
