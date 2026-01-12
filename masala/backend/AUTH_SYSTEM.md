# Phase 1: Authentication System - Complete ✅

## 📁 Folder Structure

```
backend/
└── src/
    ├── config/
    │   ├── db.js              # MongoDB connection setup
    │   └── jwt.js             # JWT configuration & utilities
    ├── models/
    │   └── User.model.js      # User schema with password hashing
    ├── controllers/
    │   └── auth.controller.js # Register & Login logic
    ├── routes/
    │   └── auth.routes.js     # Auth endpoints
    ├── middlewares/
    │   ├── auth.middleware.js # JWT verification
    │   └── role.middleware.js # Role-based access control
    ├── validations/
    │   └── auth.validation.js # Input validation rules
    └── utils/
        └── token.util.js      # Token generation helpers
```

---

## 🔐 User Model

**Fields:**
- `name` - String (required, 2-50 chars)
- `email` - String (unique, validated)
- `password` - String (hashed with bcrypt, min 6 chars)
- `role` - Enum: 'customer' | 'admin' | 'wholesale' (default: 'customer')
- `isActive` - Boolean (default: true)
- `timestamps` - Auto-generated createdAt/updatedAt

**Methods:**
- `comparePassword()` - Verify password
- `toJSON()` - Remove password from response

---

## 🔗 API Endpoints

### 1️⃣ Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### 2️⃣ Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

## 🛡️ Middleware Usage

### Protect Routes
```javascript
const authMiddleware = require('./src/middlewares/auth.middleware');
const { isAdmin, isWholesale } = require('./src/middlewares/role.middleware');

// Protected route (any authenticated user)
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

// Admin only
router.get('/admin/dashboard', authMiddleware, isAdmin, (req, res) => {
    res.json({ message: 'Admin access granted' });
});

// Wholesale only
router.get('/wholesale/pricing', authMiddleware, isWholesale, (req, res) => {
    res.json({ message: 'Wholesale pricing' });
});
```

---

## ⚙️ Environment Variables

Add to `.env`:
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/al-harmain-foods

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## 🧪 Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

**Protected Route Example:**
```bash
# Save token from login
TOKEN="your-jwt-token-here"

# Use token in protected route
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Start Server

```bash
# Use the new auth-integrated server
node server-auth.js

# OR with nodemon
nodemon server-auth.js
```

Server will display:
```
🚀 Server running on port 5000
📍 Environment: development
🔗 API URL: http://localhost:5000/api
✅ Auth endpoints ready:
   POST http://localhost:5000/api/auth/register
   POST http://localhost:5000/api/auth/login
```

---

## ✅ Features Implemented

- [x] User registration with validation
- [x] Password hashing (bcrypt)
- [x] JWT token generation
- [x] Login with credentials verification
- [x] JWT authentication middleware
- [x] Role-based access control (admin, wholesale, customer)
- [x] Input validation
- [x] Error handling
- [x] Active user check

---

## 📦 Dependencies Used

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `express-validator` - Input validation
- `dotenv` - Environment variables

---

## 🎯 Next Steps (Future Phases)

- Password reset flow
- Email verification
- Refresh tokens
- Social auth (Google, Facebook)
- 2FA (Two-factor authentication)

---

**Status**: ✅ Phase 1 Complete - Production Ready
