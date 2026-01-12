# Postman Testing Guide - Al-Harmain Auth API

## 📥 Import Postman Collection

1. **Postman kholein**
2. **Import** button par click karein
3. **File upload** karein: `Al-Harmain-Auth.postman_collection.json`
4. Collection import ho jayegi

---

## 🚀 Testing Steps

### Step 1️⃣: Server Start Karein

Terminal mein:
```bash
# Pehle purana server band karein (Ctrl+C)
# Phir naya auth server chalayein:
node server-auth.js
```

Ya agar nodemon use kar rahe hain:
```bash
nodemon server-auth.js
```

Server running message dikhna chahiye:
```
🚀 Server running on port 5000
✅ Auth endpoints ready:
   POST http://localhost:5000/api/auth/register
   POST http://localhost:5000/api/auth/login
```

---

### Step 2️⃣: Health Check

**Postman mein:**
- Collection se **"Health Check"** request select karein
- **Send** button dabayein

**Expected Response:**
```json
{
  "success": true,
  "message": "Al-Harmain Auth API is running",
  "timestamp": "2025-12-20T..."
}
```

✅ Agar yeh response aya to server chal raha hai!

---

### Step 3️⃣: Register User

**Postman mein:**
- **"Register User"** request select karein
- Body tab mein dekh lein (already filled hai):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```
- **Send** dabayein

**Expected Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f123abc...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

✅ **Token ko copy kar lein** - aage use hoga!

---

### Step 4️⃣: Login User

**Same user se login test karein:**
- **"Login User"** request select karein
- Body already filled hai:
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
- **Send** dabayein

**Expected Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f123abc...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

✅ Dobara token mil gaya!

---

### Step 5️⃣: Protected Route Test (Optional)

**Token ke saath protected route test karein:**
- **"Protected Route Example"** select karein
- **Headers** tab mein jaye
- `Authorization` header mein apna token paste karein:
  ```
  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Send** dabayein

*(Note: Yeh route abhi implement nahi hai, 404 ayega - bas example hai)*

---

## 🧪 Test Scenarios

### ✅ Success Cases

1. **Register with valid data** → 201 + token
2. **Login with correct credentials** → 200 + token
3. **Health check** → 200 + message

### ❌ Error Cases to Test

1. **Register with duplicate email:**
   - Dobara same email se register karein
   - Response: `400 - User with this email already exists`

2. **Register with invalid email:**
   ```json
   {
     "name": "Test",
     "email": "invalidemail",
     "password": "123456"
   }
   ```
   - Response: `400 - Please provide a valid email address`

3. **Register with short password:**
   ```json
   {
     "name": "Test",
     "email": "test2@example.com",
     "password": "123"
   }
   ```
   - Response: `400 - Password must be at least 6 characters`

4. **Login with wrong password:**
   ```json
   {
     "email": "test@example.com",
     "password": "wrongpassword"
   }
   ```
   - Response: `401 - Invalid credentials`

5. **Login with non-existent email:**
   ```json
   {
     "email": "notexist@example.com",
     "password": "123456"
   }
   ```
   - Response: `401 - Invalid credentials`

---

## 📝 Notes

- **MongoDB running hona chahiye** for registration/login to work
- Token **7 days** tak valid rahega
- **Password hashed** hai database mein (bcrypt)
- Default role **"customer"** assign hota hai

---

## 🔧 Troubleshooting

### Server nahi chal raha?
```bash
# Check if MongoDB running
# Check .env file mein MONGO_URI correct hai
# Terminal mein server logs check karein
```

### 500 Error aa raha?
- MongoDB connection check karein
- Console logs dekh lein server ke

### 404 Error?
- URL correct hai? `http://localhost:5000/api/auth/...`
- Port 5000 already use to nahi ho raha?

---

**Happy Testing! 🎉**
