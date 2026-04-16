# TaskFlow — Advanced MERN To-Do Application

A full-stack To-Do List application built with MongoDB, Express.js, React.js, and Node.js.

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, me
│   │   └── taskController.js      # Full CRUD + stats
│   ├── middleware/
│   │   ├── auth.js                # JWT protect middleware
│   │   ├── errorHandler.js        # Global error handler
│   │   └── validation.js          # express-validator rules
│   ├── models/
│   │   ├── User.js                # User schema + bcrypt
│   │   └── Task.js                # Task schema + indexes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── FilterBar.js       # Search, filter, sort controls
    │   │   ├── Navbar.js          # Top navigation bar
    │   │   ├── Pagination.js      # Page controls
    │   │   ├── StatsBar.js        # Task count dashboard
    │   │   ├── TaskCard.js        # Individual task card
    │   │   └── TaskModal.js       # Create / edit modal
    │   ├── context/
    │   │   └── AuthContext.js     # Auth state + JWT storage
    │   ├── hooks/
    │   │   └── useTasks.js        # All task API calls
    │   ├── pages/
    │   │   ├── Dashboard.js       # Main task view
    │   │   ├── Login.js
    │   │   └── Register.js
    │   ├── utils/
    │   │   └── api.js             # Axios instance + interceptors
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## ✅ Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18.x or 20.x (LTS) | https://nodejs.org |
| MongoDB | 6.x or 7.x | https://www.mongodb.com/try/download/community |
| npm | comes with Node.js | — |

Verify installations:
```bash
node --version    # Should show v18.x.x or v20.x.x
npm --version     # Should show 9.x.x or 10.x.x
mongod --version  # Should show v6.x.x or v7.x.x
```

---

## 🚀 Step-by-Step Setup

### Step 1 — Start MongoDB

**Windows:**
```bash
# Option A: If installed as a service, it auto-starts. Check with:
net start MongoDB

# Option B: Start manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**macOS:**
```bash
# If installed via Homebrew:
brew services start mongodb-community

# Or manually:
mongod --config /usr/local/etc/mongod.conf
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod   # auto-start on boot
```

**Verify MongoDB is running:**
```bash
mongosh
# You should see the MongoDB shell prompt. Type: exit
```

---

### Step 2 — Set Up the Backend

```bash
# Navigate to backend folder
cd todo-app/backend

# Install dependencies
npm install

# The .env file is already created. Review it:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/todoapp
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# JWT_EXPIRE=7d
# NODE_ENV=development

# IMPORTANT: Change JWT_SECRET to a strong random string in production!
```

**Start the backend server:**
```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR production mode
npm start
```

**Expected output:**
```
🚀 Server running on http://localhost:5000
📋 Environment: development
✅ MongoDB Connected: localhost
```

---

### Step 3 — Set Up the Frontend

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend folder
cd todo-app/frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

**Expected output:**
```
Compiled successfully!
Local:  http://localhost:3000
```

Your browser should automatically open `http://localhost:3000`

---

### Step 4 — Use the Application

1. Open `http://localhost:3000` in your browser
2. Click **"Create one"** to register a new account
3. Fill in your name, email, and password (min 6 chars)
4. You'll be automatically logged in and redirected to the dashboard
5. Click **"+ New Task"** to create your first task
6. Use the filter bar to search, filter by status/priority, and sort tasks

---

## 🔌 REST API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks (paginated) | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| PATCH | `/api/tasks/:id/status` | Update status only | Yes |
| DELETE | `/api/tasks/completed` | Delete all completed | Yes |

### GET /api/tasks — Query Parameters

| Parameter | Type | Values | Default |
|-----------|------|--------|---------|
| `page` | number | 1, 2, 3... | 1 |
| `limit` | number | 1–50 | 10 |
| `status` | string | Pending, In-Progress, Completed | — |
| `priority` | string | Low, Medium, High | — |
| `search` | string | any text | — |
| `sortBy` | string | createdAt, updatedAt, title, dueDate, priority, status | createdAt |
| `order` | string | asc, desc | desc |

**Example:** `GET /api/tasks?status=Pending&priority=High&sortBy=dueDate&order=asc&page=1&limit=5`

---

## 🧪 Test API with curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login (save the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Create task (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Task","description":"Task details","priority":"High"}'

# Get all tasks
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

---

## ⚙️ Features Implemented

- **JWT Authentication** — Register, login, protected routes
- **Full CRUD** — Create, read, update, delete tasks
- **Status Workflow** — Pending → In-Progress → Completed (click badge to cycle)
- **Priority Levels** — Low / Medium / High
- **Due Dates** — With overdue detection
- **Tags** — Up to 5 tags per task
- **Pagination** — Server-side with page controls
- **Filtering** — By status, priority, text search
- **Sorting** — By 6 fields, ascending or descending
- **Task Statistics** — Live count of tasks by status
- **Server-side Validation** — express-validator on all routes
- **Global Error Handling** — Structured error responses
- **Responsive Design** — Mobile-friendly dark UI

---

## 🛠️ Common Issues & Fixes

**MongoDB connection fails:**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
# If it fails, start MongoDB (see Step 1)
```

**Port 5000 already in use:**
```bash
# Change PORT in backend/.env to 5001, then update frontend/package.json:
# "proxy": "http://localhost:5001"
```

**Port 3000 already in use:**
```bash
# React will ask to use another port automatically. Press Y.
```

**npm install fails:**
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

**"Cannot find module" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---
