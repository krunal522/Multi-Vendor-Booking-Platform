# 🥇 ServeBook — Multi-Vendor Service Booking & Management Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-emerald?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

An enterprise-grade, full-stack **On-Demand Multi-Vendor Service Booking & Management Platform** (like Urban Company / Housejoy). Built using the MERN stack with modern dark-mode glassmorphic aesthetics, 3-tier Role-Based Access Control (RBAC), real-time notifications, atomic calendar slot booking, and comprehensive vendor/admin revenue analytics.

---

## 🌟 Key Highlights & Features

### 👥 3-Tier Role-Based Access Control (RBAC)
- **Customer Role**:
  - Explore verified doorstep services with instant filters (Category, Price, Rating, Location).
  - Conflict-free slot booking with calendar date & time picker.
  - Real-time booking tracking (Pending → Confirmed → In Progress → Completed → Cancelled).
  - Service rating and customer review workflow.
- **Vendor Role**:
  - Dedicated Vendor Portal with revenue breakdowns and booking KPIs.
  - Create and manage service listings with image selection and tag management.
  - 14-day automated calendar slot generation.
  - Accept, progress, and complete client appointments.
- **Admin Role**:
  - Comprehensive platform governance dashboard (Gross volume, platform cut, vendor earnings).
  - Service catalog management with 1-click Approval / Rejection toggle.
  - User and vendor verification administration.

---

### 🛡️ Architecture & Security
- **Dual-Token Authentication**: Short-lived JWT Access Tokens (15m) paired with cryptographic Refresh Tokens (7d).
- **Password Protection**: Salted Bcrypt hashing (10 rounds); passwords never returned in API queries (`select: false`).
- **Atomic Slot Reservation**: Database locking to prevent race conditions and concurrent double-bookings.
- **Server-Authoritative Pricing**: Service fees and 10% platform cuts calculated strictly on the backend to prevent client-side fee manipulation.
- **Hardened HTTP Layer**: Helmet security headers, CORS origin whitelisting, and rate limiting against brute force attempts.
- **Strict Schema Validation**: Real-time frontend inline alerts matched with backend `express-validator` rules.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, React Icons, Recharts, Date-fns, Hot-Toast |
| **Styling** | Modern CSS3 Design System (Glassmorphism, CSS Tokens, Responsive Dark Mode) |
| **Backend** | Node.js, Express.js, Socket.io (WebSockets), Multer, Helmet, Morgan |
| **Database** | MongoDB with Mongoose ODM (Compound Indexing, Aggregations, Slugs) |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, Express-Validator, Express-Rate-Limit |

---

## 📂 Project Structure

```text
Multi-Vendor-Booking-Platform/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection & seed script
│   │   ├── controllers/    # Business logic (Auth, Service, Booking, Admin, Vendor)
│   │   ├── middleware/     # Auth, RBAC, Validation & Centralized Error Handlers
│   │   ├── models/         # Mongoose schemas (User, Service, Booking, Review, Notification)
│   │   └── routes/         # Modular REST API routes
│   ├── uploads/            # Media assets storage
│   ├── package.json
│   └── server.js           # Express app & Socket.io server entry
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, Logo)
│   │   ├── context/        # Auth Context & State Management
│   │   ├── hooks/          # Custom hooks (Socket.io realtime listener)
│   │   ├── pages/          # Pages (Customer, Vendor, Admin, Privacy Policy)
│   │   ├── utils/          # Axios API client & Image maps
│   │   ├── App.jsx         # Route declarations & PrivateRoute guards
│   │   └── index.css       # Core design tokens, dark theme & utility classes
│   ├── package.json
│   └── vite.config.js
│
├── package.json            # Root orchestrator with concurrently scripts
└── .gitignore              # Clean version control exclusions
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance on `mongodb://localhost:27017` or MongoDB Atlas URI)

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/Multi-Vendor-Booking-Platform.git
cd Multi-Vendor-Booking-Platform
```

### 3. Install Dependencies
```bash
# Install root, backend, and frontend packages
npm run install:all
```

### 4. Configure Environment Variables
Inside `backend/` folder, copy the example environment file:
```bash
cp backend/.env.example backend/.env
```
Default configuration values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/booking-platform
JWT_SECRET=mfe_jwt_super_secret_key_2024_booking_platform
JWT_REFRESH_SECRET=mfe_refresh_super_secret_key_2024
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 5. Start the Application
Run both Backend and Frontend concurrently with one command from root:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API & Health**: `http://localhost:5000/api/health`

---

## 🔑 Demo Login Credentials

The database auto-seeds verified demo accounts on first boot:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@techcorp.com` | `Admin@123` | Platform Metrics, User Management, Service Approval |
| **Vendor (Salon)** | `vendor1@test.com` | `Vendor@123` | Service Listings, Slot Schedule, Earnings Analytics |
| **Vendor (Cleaning)** | `vendor2@test.com` | `Vendor@123` | Manage Cleaning Bookings, Availability |
| **Customer** | `customer@test.com` | `Customer@123` | Browse Services, Slot Booking, Review System |

---

## 📡 REST API Reference

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new customer or vendor |
| `/api/auth/login` | `POST` | Public | Login and receive dual JWT tokens |
| `/api/services` | `GET` | Public | Search, sort, and filter service catalog |
| `/api/services/:id` | `GET` | Public | Fetch service details and availability |
| `/api/services` | `POST` | Vendor/Admin | Publish new service offering |
| `/api/bookings` | `POST` | Customer/Admin | Create conflict-free slot booking |
| `/api/bookings/my` | `GET` | Customer | Fetch logged-in user booking history |
| `/api/vendor/dashboard` | `GET` | Vendor | Vendor revenue & booking statistics |
| `/api/admin/dashboard` | `GET` | Admin | High-level platform KPIs & aggregates |
| `/api/admin/services/:id/approve` | `PUT` | Admin | Approve or reject vendor service |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
