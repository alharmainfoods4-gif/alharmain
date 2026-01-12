# Al-Harmain Foods - Backend API

Production-ready Express.js backend for Al-Harmain Premium Foods e-commerce platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── config/          # Database, Cloudinary, Email config
├── controllers/     # Business logic
├── middlewares/     # Auth, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Email, upload, price services
├── utils/           # Helper functions
├── validations/     # Input validation schemas
├── uploads/         # Temp file storage
├── logs/            # Error logs
├── app.js           # Express app setup
└── server.js        # Server entry point
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Products
- `GET /api/products` - Get all products (filters, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/review` - Add review (Protected)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get cart (Protected)
- `POST /api/cart/add` - Add to cart (Protected)
- `PUT /api/cart/update` - Update quantity (Protected)
- `DELETE /api/cart/remove/:productId` - Remove item (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `GET /api/orders/track/:orderNumber` - Track order (Public)
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Wholesale
- `POST /api/wholesale/register` - Register wholesale (Protected)
- `GET /api/wholesale/account` - Get account (Protected)
- `GET /api/wholesale/pricing` - Get pricing (Wholesale)
- `PUT /api/wholesale/:id/approve` - Approve account (Admin)

### CMS
- `GET /api/cms/content/:slug` - Get content
- `PUT /api/cms/content/:slug` - Update content (Admin)
- `POST /api/cms/contact` - Submit contact form
- `POST /api/cms/chatbot` - Chatbot endpoint

### Upload
- `POST /api/upload` - Upload single image (Admin)
- `POST /api/upload/multiple` - Upload multiple images (Admin)

---

## 🛡️ Security Features

- JWT authentication with Bearer tokens
- Password hashing with bcrypt
- Rate limiting (100 requests/15 minutes)
- MongoDB sanitization
- Helmet security headers
- Input validation with express-validator
- Role-based access control (customer, admin, wholesale)

---

## 📧 Email Templates

Automated emails for:
- Welcome email on registration
- Password reset with secure token
- Order confirmation with details
- Order status updates

---

## 🌐 Environment Variables

Required variables (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `CLOUDINARY_*` - Cloudinary credentials
- `SMTP_*` - Email server credentials

---

## 🧪 Testing

Test API with Postman or Thunder Client:

1. Register a test user
2. Login to get JWT token
3. Add `Authorization: Bearer <token>` header
4. Test protected routes

---

## 📦 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use secure `JWT_SECRET`
- [ ] Configure MongoDB Atlas
- [ ] Set up Cloudinary account
- [ ] Configure email service
- [ ] Enable CORS for frontend domain
- [ ] Set up SSL/HTTPS

### Deployment Platforms
- **Heroku, Render, Railway** - Direct deployment
- **Vercel** - Serverless deployment
- **VPS** - Traditional server deployment

---

## 📝 Models

- **User** - Authentication, roles, addresses
- **Product** - Products with variants, reviews
- **Category** - Product categories
- **Cart** - Shopping cart
- **Order** - Order tracking, status history
- **Wholesale** - B2B accounts, pricing tiers
- **Content** - CMS for static pages

---

## 👨‍💻 Development

```bash
# Watch mode
npm run dev

# Check logs
tail -f logs/error.log
```

---

## 🤝 Support

For issues or questions, contact: support@alharmainfoods.com

---

**Built with ❤️ by Al-Harmain Foods Development Team**
