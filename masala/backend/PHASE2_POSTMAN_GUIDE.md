# Postman Testing Guide - Phase 2
## Category & Product APIs

---

## 📝 Pre-Requisites

1. **Server running hona chahiye:**
   ```bash
   nodemon server-auth.js
   ```

2. **Admin Token lena hoga:**
   - Pehle login karein (Phase 1)
   - Admin user banana hoga ya existing user ko manually admin banana hoga

---

## 🔐 Step 1: Get Admin Token

### Login as Admin
```
Method: POST
URL: http://localhost:5000/api/auth/login

Body (JSON):
{
  "email": "admin@example.com",
  "password": "123456"
}
```

**Token copy kar lein response se!**

---

## 📁 CATEGORY APIs

### 1️⃣ Create Category (Admin Required)
```
Method: POST
URL: http://localhost:5000/api/categories

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN_HERE
Content-Type: application/json

Body (JSON):
{
  "name": "Spices",
  "image": "https://example.com/spices.jpg"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "...",
    "name": "Spices",
    "slug": "spices",
    "image": "...",
    "isActive": true
  }
}
```

---

### 2️⃣ Get All Categories (Public - No Token Needed)
```
Method: GET
URL: http://localhost:5000/api/categories

Headers: None needed
```

---

### 3️⃣ Get Single Category (Public)
```
Method: GET
URL: http://localhost:5000/api/categories/CATEGORY_ID

Replace CATEGORY_ID with actual ID from create response
```

---

### 4️⃣ Update Category (Admin)
```
Method: PUT
URL: http://localhost:5000/api/categories/CATEGORY_ID

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

Body (JSON):
{
  "name": "Updated Spices",
  "image": "https://new-image.jpg"
}
```

---

### 5️⃣ Delete Category (Admin)
```
Method: DELETE
URL: http://localhost:5000/api/categories/CATEGORY_ID

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

## 🛍️ PRODUCT APIs

### 1️⃣ Create Product (Admin Required)
```
Method: POST
URL: http://localhost:5000/api/products

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

Body (JSON):
{
  "name": "Bombay Biryani Masala",
  "category": "CATEGORY_ID_HERE",
  "description": "Premium quality biryani masala with authentic spices",
  "basePrice": 350,
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "variants": [
    { "size": "100g", "price": 350 },
    { "size": "250g", "price": 800 }
  ],
  "badges": ["Best Seller", "Premium"]
}
```

---

### 2️⃣ Get All Products (Public)
```
Method: GET
URL: http://localhost:5000/api/products

No headers needed
```

**With Filters:**
```
URL: http://localhost:5000/api/products?category=CATEGORY_ID&minPrice=100&maxPrice=1000&page=1&limit=12
```

---

### 3️⃣ Get Single Product by Slug (Public)
```
Method: GET
URL: http://localhost:5000/api/products/bombay-biryani-masala

Slug auto-generate hoti hai name se
```

---

### 4️⃣ Update Product (Admin)
```
Method: PUT
URL: http://localhost:5000/api/products/PRODUCT_ID

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

Body (JSON):
{
  "name": "Updated Product Name",
  "basePrice": 400,
  "badges": ["Best Seller", "New Arrival"]
}
```

---

### 5️⃣ Delete Product (Admin)
```
Method: DELETE
URL: http://localhost:5000/api/products/PRODUCT_ID

Headers:
Authorization: Bearer YOUR_ADMIN_TOKEN
```

---

### 6️⃣ Add Review (Any Authenticated User)
```
Method: POST
URL: http://localhost:5000/api/products/PRODUCT_ID/reviews

Headers:
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json

Body (JSON):
{
  "rating": 5,
  "comment": "Excellent product! Highly recommended for authentic taste."
}
```

---

## 🧪 Testing Flow

### Test Order:
1. **Login** → Get admin token
2. **Create Category** → Get category ID
3. **Create Product** → Use category ID
4. **Get Products** → Verify creation
5. **Get Single Product** → Test by slug
6. **Add Review** → As regular user
7. **Update Product** → As admin
8. **Delete** → Soft delete test

---

## 📋 Quick Copy URLs

```
# Auth
POST   http://localhost:5000/api/auth/login

# Categories
GET    http://localhost:5000/api/categories
POST   http://localhost:5000/api/categories
GET    http://localhost:5000/api/categories/:id
PUT    http://localhost:5000/api/categories/:id
DELETE http://localhost:5000/api/categories/:id

# Products
GET    http://localhost:5000/api/products
POST   http://localhost:5000/api/products
GET    http://localhost:5000/api/products/:slug
PUT    http://localhost:5000/api/products/:id
DELETE http://localhost:5000/api/products/:id
POST   http://localhost:5000/api/products/:id/reviews
```

---

## ⚠️ Common Errors

**401 Unauthorized:**
- Token missing ya invalid hai
- Admin token use karein for admin routes

**400 Validation Error:**
- Required fields missing hain
- Body format check karein

**404 Not Found:**
- ID ya slug galat hai
- GET request pehle karke verify karein

---

## 💡 Tips

1. **IDs save kar lein** - Category aur Product IDs notes mein rakhein
2. **Admin user pehle banayein** - Database mein manually role = "admin" set karein
3. **Token refresh** - JWT expire hone par dobara login karein
4. **Slugs auto-generate** - Product name se slug automatically banti hai

---

**Happy Testing! 🎉**
