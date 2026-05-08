# Flocksy Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm or yarn installed
- PostgreSQL database (Supabase configured)
- Redis instance (Redis Cloud configured)

### Step 1: Clone and Setup (if not done)

```bash
cd Flocksy
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Verify .env file exists with correct values
cat .env

# Start backend server
npm run dev
```

**Expected Output**:
```
Server running on port 8080
Connected to PostgreSQL
Connected to Redis
```

**Verify Backend**:
```bash
curl http://localhost:8080/api/v1/health
```

Should return:
```json
{"service":"focksy-backend","status":"ok"}
```

### Step 3: Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend (note the space in directory name)
cd "Flocksy/frontend "

# Install dependencies
npm install

# Verify .env.local exists
cat .env.local

# Start frontend server
npm run dev
```

**Expected Output**:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Open Browser

Navigate to: **http://localhost:5173**

You should see the Flocksy home page!

### Step 5: Test the Integration

In a **third terminal**:

```bash
cd Flocksy
./test-api.sh
```

This will test all API endpoints and verify everything is working.

## 🎯 Quick Test Checklist

### Backend Tests
- [ ] Health check responds: `curl http://localhost:8080/api/v1/health`
- [ ] Backend logs show no errors
- [ ] PostgreSQL connection successful
- [ ] Redis connection successful

### Frontend Tests
- [ ] Home page loads at http://localhost:5173
- [ ] No console errors in browser DevTools
- [ ] Navigation works (Dashboard, Chatbot, Vets, Crop Advisor)
- [ ] Sidebar opens and closes

### Integration Tests
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Dashboard loads data (or shows mock data)
- [ ] Chatbot accepts queries
- [ ] Vet directory shows vets
- [ ] Crop advisor page loads

## 🔧 Common Issues & Fixes

### Issue: Backend won't start

**Error**: `Port 8080 already in use`

**Fix**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use a different port in backend/.env
PORT=8081
```

### Issue: Frontend won't start

**Error**: `Port 5173 already in use`

**Fix**:
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Issue: CORS errors in browser

**Fix**:
1. Verify backend is running on port 8080
2. Check `.env.local` in frontend:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
3. Restart frontend: `npm run dev`

### Issue: Database connection error

**Fix**:
1. Check `DATABASE_URL` in `backend/.env`
2. Verify Supabase is accessible
3. Test connection:
   ```bash
   psql "postgresql://postgres:password@host:5432/postgres"
   ```

### Issue: Redis connection error

**Fix**:
1. Check `REDIS_URL` in `backend/.env`
2. Verify Redis Cloud is accessible
3. Test connection:
   ```bash
   redis-cli -u "redis://default:password@host:port"
   ```

### Issue: AI Chat not working

**Fix**:
1. AI Core service must be running on port 8000
2. Check `AI_CORE_URL` in `backend/.env`
3. Start AI Core:
   ```bash
   cd Flocksy/ai-core
   python -m uvicorn app.main:app --reload
   ```

## 📱 Using the Application

### 1. Register/Login

1. Click "Login" in sidebar
2. Register a new account or use test credentials:
   - Email: `test@flocksy.com`
   - Password: `test123456`

### 2. Dashboard

- View farm statistics
- Check health alerts
- Manage tasks
- See recent activities

### 3. Chatbot

- Ask questions about poultry health
- Get vaccination schedules
- Diagnose symptoms
- Example: "What is the vaccination schedule for broiler chickens?"

### 4. Crop Advisor

- Upload crop images
- Get disease diagnosis
- Receive treatment recommendations

### 5. Vet Directory

- Browse available veterinarians
- Filter by specialty
- Check availability
- Book consultations

## 🎨 Theme Customization

The Flocksy theme uses:
- **Primary Color**: Emerald (#10b981)
- **Accent Color**: Amber (#f59e0b)
- **Background**: Off-white (#f6f8fb)
- **Text**: Slate (#0f172a)

To customize, edit `Flocksy/frontend /index.css`:

```css
:root {
  --green-dark: #0f5f4b;
  --green-mid: #15795f;
  --saffron: #f0ab2e;
  /* Add your colors */
}
```

## 📊 Monitoring

### Backend Logs
Watch backend terminal for:
- API requests (Morgan logger)
- Database queries
- Error messages
- AI Core responses

### Frontend Logs
Open browser DevTools (F12):
- Console: JavaScript errors
- Network: API requests/responses
- Application: LocalStorage (JWT token)

## 🔐 Security Notes

### Development
- JWT tokens stored in localStorage
- CORS allows all origins
- No HTTPS required

### Production
- Use HTTPS only
- Restrict CORS to your domain
- Use secure cookies for tokens
- Enable rate limiting
- Add CSP headers

## 📚 Next Steps

After getting started:

1. **Read Documentation**
   - `API_INTEGRATION.md` - Complete API docs
   - `INTEGRATION_SUMMARY.md` - Integration details

2. **Explore Code**
   - Frontend: `Flocksy/frontend /src/`
   - Backend: `Flocksy/backend/src/`

3. **Customize**
   - Update theme colors
   - Add new features
   - Modify dashboard layout

4. **Deploy**
   - Build frontend: `npm run build`
   - Build backend: `npm run build`
   - Deploy to hosting service

## 🎉 You're Ready!

Your Flocksy application is now running with:
- ✅ Backend API on port 8080
- ✅ Frontend UI on port 5173
- ✅ Database connected (PostgreSQL)
- ✅ Cache connected (Redis)
- ✅ Authentication working
- ✅ All endpoints integrated

**Enjoy building with Flocksy!** 🐔🌾

---

**Need Help?**
- Check `API_INTEGRATION.md` for detailed API docs
- Run `./test-api.sh` to verify endpoints
- Review browser console for frontend errors
- Check backend terminal for server errors
