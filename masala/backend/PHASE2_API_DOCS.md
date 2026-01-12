# Phase 2: Product & Category Management - API Documentation

## 📦 Category APIs

### 1️⃣ Create Category (Admin Only)
```http
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Spices",
  "image": "https://cloudinary.com/image.jpg"
}

Response: 201 Created
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "...",
    "name": "Spices",
    "slug": "spices",
    "image": "https://...",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### 2️⃣ Get All Categories (Public)
```http
GET /api/categories

Response: 200 OK
{
  "success": true,
  "count": 5,
  "categories": [
    {
      "_id": "...",
      "name": "Spices",
      "slug": "spices",
      "image": "...",
      "isActive": true
    }
  ]
}
```

### 3️⃣ Get Single Category (Public)
```http
GET /api/categories/:id

Response: 200 OK
{
  "success": true,
  "category": { ... }
}
```

### 4️⃣ Update Category (Admin Only)
```http
PUT /api/categories/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "image": "new-image-url",
  "isActive": true
}

Response: 200 OK
{
  "success": true,
  "message": "Category updated successfully",
  "category": { ... }
}
```

### 5️⃣ Delete Category (Admin Only - Soft Delete)
```http
DELETE /api/categories/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 🛍️ Product APIs

### 1️⃣ Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Bombay Biryani Masala",
  "category": "categoryId",
  "description": "Premium biryani masala blend",
  "basePrice": 350,
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "variants": [
    { "size": "100g", "price": 350 },
    { "size": "250g", "price": 800 }
  ],
  "badges": ["Best Seller", "Premium"]
}

Response: 201 Created
{
  "success": true,
  "message": "Product created successfully",
  "product": { ... }
}
```

### 2️⃣ Get All Products (Public with Filters)
```http
GET /api/products?category=<id>&badge=Premium&minPrice=100&maxPrice=1000&page=1&limit=12

Response: 200 OK
{
  "success": true,
  "count": 12,
  "total": 45,
  "page": 1,
  "pages": 4,
  "products": [
    {
      "_id": "...",
      "name": "...",
      "slug": "...",
      "category": {
        "_id": "...",
        "name": "Spices",
        "slug": "spices"
      },
      "description": "...",
      "basePrice": 350,
      "images": [...],
      "variants": [...],
      "badges": [...],
      "rating": 4.5,
      "reviewsCount": 23,
      "isActive": true
    }
  ]
}
```

**Query Parameters:**
- `category` - Filter by category ID
- `badge` - Filter by badge (e.g., "Best Seller", "Organic")
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

### 3️⃣ Get Single Product (Public)
```http
GET /api/products/:slug

Response: 200 OK
{
  "success": true,
  "product": {
    "_id": "...",
    "name": "Bombay Biryani Masala",
    "slug": "bombay-biryani-masala",
    "category": {
      "name": "Spices",
      "slug": "spices"
    },
    "description": "...",
    "basePrice": 350,
    "images": [...],
    "variants": [
      { "size": "100g", "price": 350 },
      { "size": "250g", "price": 800 }
    ],
    "badges": ["Best Seller"],
    "rating": 4.5,
    "reviewsCount": 12,
    "reviews": [
      {
        "_id": "...",
        "user": { "name": "John Doe" },
        "userName": "John Doe",
        "rating": 5,
        "comment": "Excellent product!",
        "createdAt": "..."
      }
    ],
    "isActive": true
  }
}
```

### 4️⃣ Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "basePrice": 400,
  "badges": ["Best Seller", "New Arrival"]
}

Response: 200 OK
{
  "success": true,
  "message": "Product updated successfully",
  "product": { ... }
}
```

### 5️⃣ Delete Product (Admin Only - Soft Delete)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 6️⃣ Add Review (Authenticated Users)
```http
POST /api/products/:id/reviews
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Amazing product! Highly recommended."
}

Response: 201 Created
{
  "success": true,
  "message": "Review added successfully",
  "review": {
    "user": "userId",
    "userName": "John Doe",
    "rating": 5,
    "comment": "...",
    "_id": "...",
    "createdAt": "..."
  }
}
```

**Review Rules:**
- User must be authenticated
- One review per user per product
- Rating: 1-5
- Comment: 10-500 characters
- Auto-updates product rating average

---

## 🎯 Access Control Summary

| Endpoint | Access Level |
|----------|-------------|
| **Categories** | |
| GET /api/categories | Public |
| GET /api/categories/:id | Public |
| POST /api/categories | Admin Only |
| PUT /api/categories/:id | Admin Only |
| DELETE /api/categories/:id | Admin Only |
| **Products** | |
| GET /api/products | Public |
| GET /api/products/:slug | Public |
| POST /api/products | Admin Only |
| PUT /api/products/:id | Admin Only |
| DELETE /api/products/:id | Admin Only |
| POST /api/products/:id/reviews | Authenticated |

---

## 🔒 Authentication

Use JWT token from Phase 1 login:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Admin Token Required For:**
- Creating categories/products
- Updating categories/products
- Deleting categories/products

---

## ✅ Features Implemented

- [x] Category CRUD with slug auto-generation
- [x] Product CRUD with variants and badges
- [x] Product filtering (category, price, badges)
- [x] Pagination support
- [x] Review system with rating auto-calculation
- [x] Soft delete (isActive flag)
- [x] Image URL storage
- [x] Admin-only access control
- [x] Input validation
- [x] Error handling

---

**Status**: ✅ Phase 2 Complete - Ready for Testing
