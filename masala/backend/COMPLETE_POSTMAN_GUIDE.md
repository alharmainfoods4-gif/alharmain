# 🚀 Al-Harmain API - Ultimate Postman Testing Guide

Ye guide aapko tamam **42 APIs** test karne mein madad degi.

## 📌 Base URL
- **URL:** `http://localhost:5000/api`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <YOUR_TOKEN>` (Protected routes ke liye)

---

## 🔐 1. Authentication (6 APIs)

### Register User
- **Method:** `POST`
- **Path:** `/auth/register`
- **Body:**
```json
{
  "name": "Admin User",
  "email": "admin@alharmain.com",
  "password": "password123"
}
```

### Login User
- **Method:** `POST`
- **Path:** `/auth/login`
- **Body:** `{ "email": "admin@alharmain.com", "password": "password123" }`

### Update Profile (New ✨)
- **Method:** `PUT`
- **Path:** `/auth/profile`
- **Body:** `{ "phone": "03432309181", "address": "Karachi, Pakistan" }`

### Change Password (New ✨)
- **Method:** `PUT`
- **Path:** `/auth/update-password`
- **Body:** `{ "currentPassword": "password123", "newPassword": "newpassword123" }`

---

## 📊 2. Admin Management (4 APIs - New ✨)

### Get All Users
- **Method:** `GET`
- **Path:** `/admin/users`
- **Note:** Admin token zaroori hai.

### Dashboard Stats
- **Method:** `GET`
- **Path:** `/admin/stats`
- **Response:** Sales, Users, aur Revenue ka real-time data milega.

---

## 💼 3. Private Transactions (3 APIs - New ✨)

### Create Transaction
- **Method:** `POST`
- **Path:** `/transactions`
- **Body:**
```json
{
  "companyName": "Al-Harmain Foods",
  "items": "Basmati Rice 50kg",
  "itemQuantity": 10,
  "totalPrice": 55000,
  "transactionType": "debit",
  "notes": "Bulk order for wholesaler"
}
```

### Get All Transactions
- **Method:** `GET`
- **Path:** `/transactions`

---

## 📦 4. Products & Categories (11 APIs)

### Create Product
- **Method:** `POST`
- **Path:** `/products`
- **Body:**
```json
{
  "name": "Biryani Masala",
  "category": "<CATEGORY_ID>",
  "basePrice": 150,
  "stock": 100,
  "description": "Premium spice mix",
  "images": ["url1", "url2"]
}
```

### Get Products
- **Method:** `GET`
- **Path:** `/products?minPrice=100&maxPrice=500`

---

## 🛒 5. Orders & Cart (10 APIs)

### Create Order
- **Method:** `POST`
- **Path:** `/orders`
- **Body:**
```json
{
  "items": [
    { "product": "<ID>", "quantity": 2, "price": 150 }
  ],
  "shippingAddress": "Street 1, Karachi",
  "paymentMethod": "COD"
}
```

### Track Order
- **Method:** `GET`
- **Path:** `/orders/track/<ORDER_NUMBER>`

---

## 🛠️ Postman Setup Tips:
1. **Environments:** Postman mein `base_url` ka variable bana lein.
2. **Auto-Token:** Login request ke `Tests` tab mein ye code likhein takay token auto-save ho jaye:
   ```js
   const response = pm.response.json();
   if (response.token) {
       pm.environment.set("token", response.token);
   }
   ```
3. **Authorization Tab:** Tamam requests ke `Auth` tab mein `Bearer Token` select karein aur `{{token}}` variable use karein.

Aapki **COMPLETE_POSTMAN_GUIDE.md** update kar di gayi hai! 🚀
