# Al-Harmain Foods API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.alharmainfoods.com/api
```

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [ ... ] // Optional validation errors
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

---

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "03001234567"
}

Response: 201 Created
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
Returns: Same as register
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "data": {
    "user": { ... full user object ... }
  }
}
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "03009876543",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Karachi",
    "postalCode": "75500"
  }
}

Response: 200 OK
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "status": "success",
  "message": "Password reset email sent"
}
```

#### Reset Password
```http
POST /auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}

Response: 200 OK
```

---

### 📦 Products (`/api/products`)

#### Get All Products
```http
GET /products?page=1&limit=12&category=<categoryId>&search=biryani&minPrice=100&maxPrice=1000&sort=price&order=asc&featured=true

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 12)
- category: Filter by category ID
- search: Search in product names
- minPrice: Minimum price filter
- maxPrice: Maximum price filter
- sort: Sort field (price, rating, createdAt)
- order: asc or desc
- featured: true/false

Response: 200 OK (Paginated)
```

#### Get Single Product
```http
GET /products/:id

Response: 200 OK
{
  "status": "success",
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "_id": "...",
      "name": "Bombay Biryani Masala",
      "category": { ... },
      "price": 350,
      "variants": [ ... ],
      "images": [ ... ],
      "rating": 5.0,
      "reviews": [ ... ]
    }
  }
}
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Premium Black Pepper",
  "category": "categoryId",
  "description": "High quality black pepper...",
  "price": 450,
  "images": ["url1", "url2"],
  "variants": [
    { "size": "100g", "price": 450, "sku": "S100", "stock": 50 }
  ],
  "badges": ["Premium", "Pure"],
  "ingredients": ["100% Pure Black Peppercorns"],
  "stock": 100
}

Response: 201 Created
```

#### Add Product Review
```http
POST /products/:id/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product quality!"
}

Response: 201 Created
```

---

### 🏷️ Categories (`/api/categories`)

#### Get All Categories
```http
GET /categories

Response: 200 OK
{
  "status": "success",
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Hot Chilli Spices",
        "slug": "hot-chilli-spices",
        "description": "...",
        "image": "..."
      }
    ]
  }
}
```

---

### 🛒 Cart (`/api/cart`)

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>

Response: 200 OK
```

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "productId",
  "quantity": 2,
  "variantSku": "S100" // Optional
}

Response: 200 OK
```

#### Update Cart
```http
PUT /cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "productId",
  "quantity": 3
}

Response: 200 OK
```

#### Remove from Cart
```http
DELETE /cart/remove/:productId
Authorization: Bearer <token>

Response: 200 OK
```

---

### 📋 Orders (`/api/orders`)

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "productId",
      "name": "Product Name",
      "price": 350,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "03001234567",
    "email": "john@example.com",
    "street": "123 Main St",
    "city": "Karachi",
    "postalCode": "75500"
  },
  "paymentMethod": "COD",
  "notes": "Please deliver after 5 PM"
}

Response: 201 Created
{
  "status": "success",
  "data": {
    "order": {
      "orderNumber": "AH-...",
      "totalPrice": 900,
      "status": "Pending",
      ...
    }
  }
}
```

#### Track Order
```http
GET /orders/track/:orderNumber

Response: 200 OK
{
  "status": "success",
  "data": {
    "order": {
      "orderNumber": "AH-...",
      "status": "Shipped",
      "statusHistory": [ ... ]
    }
  }
}
```

#### Get User Orders
```http
GET /orders?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK (Paginated)
```

---

### 🏢 Wholesale (`/api/wholesale`)

#### Register Wholesale
```http
POST /wholesale/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessName": "ABC Traders",
  "businessType": "Retailer",
  "taxId": "1234567890",
  "businessAddress": {
    "street": "...",
    "city": "..."
  }
}

Response: 201 Created
```

#### Get Wholesale Pricing
```http
GET /wholesale/pricing
Authorization: Bearer <wholesale_token>

Response: 200 OK
{
  "status": "success",
  "data": {
    "pricing": {
      "discountTier": "Silver",
      "discountPercentage": 10,
      "minimumOrder": 10000
    }
  }
}
```

---

### 📄 CMS (`/api/cms`)

#### Get Content
```http
GET /cms/content/:slug
Example: GET /cms/content/about-us

Response: 200 OK
```

#### Submit Contact Form
```http
POST /cms/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "03001234567",
  "subject": "Product Inquiry",
  "message": "I would like to know about..."
}

Response: 200 OK
```

---

### 📸 Upload (`/api/upload`)

#### Upload Single Image
```http
POST /upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

FormData:
  image: <file>

Response: 200 OK
{
  "status": "success",
  "data": {
    "url": "https://cloudinary.../image.jpg",
    "publicId": "..."
  }
}
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (Missing/Invalid Token)
- `403` - Forbidden (Insufficient Permissions)
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Response**: 429 Too Many Requests

---

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","phone":"1234567890"}'

# Login and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' | jq -r '.token')

# Get products
curl http://localhost:5000/api/products

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"...","quantity":1}'
```

---

**Last Updated**: 2025-12-20
