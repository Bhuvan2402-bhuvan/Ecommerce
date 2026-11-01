# ShopSphere — Full-Stack E-Commerce Platform

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue.svg)](https://supabase.com/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

ShopSphere is an enterprise-grade full-stack e-commerce marketplace featuring modern dark-mode aesthetics, role-based authorization, inventory management with concurrency locks, shopping cart drawer, multi-step checkout, real-time analytics, and cloud database persistence via Supabase PostgreSQL.

---

## 🌟 Key Features

- **🛍️ Storefront & Catalog**:
  - Hero banner with quick category navigation and stats.
  - Curated featured products with responsive price tags in INR (₹).
  - Advanced search, live category filtering, price bounds, and stock badges.
- **🔐 Secure Authentication**:
  - Stateless JWT authentication with Spring Security 6.
  - Role-based authorization (`CUSTOMER` and `ADMIN`).
  - BCrypt password hashing.
- **🛒 Shopping Cart**:
  - Sliding slide-out cart drawer with real-time subtotal calculation.
  - Stock validation and optimistic cart synchronization.
- **💳 Checkout & Orders**:
  - Full shipping address capture and validation.
  - Pessimistic write locking on inventory to prevent overselling.
  - Order tracking across lifecycle states (`PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
- **📊 Admin Dashboard**:
  - Real-time revenue and order KPI analytics.
  - Full product inventory management (CRUD).
  - Category manager and live order fulfillment controls.

---

## 🏗️ Architecture

```
ShopSphere/
├── backend/                       # Spring Boot 3 & Java 21 REST API
│   ├── src/main/java/com/shopsphere/
│   │   ├── config/                # SecurityConfig, JpaConfig, AdminInitializer
│   │   ├── controller/            # Auth, Products, Categories, Cart, Orders, Admin
│   │   ├── dto/                   # Requests & Responses
│   │   ├── entity/                # User, Product, Category, Cart, CartItem, Order
│   │   ├── exception/             # GlobalExceptionHandler & custom exceptions
│   │   ├── repository/            # Spring Data JPA Repositories
│   │   └── service/               # Business logic & transaction boundaries
│   ├── src/main/resources/
│   │   ├── db/migration/          # Flyway V1 (Schema) and V2 (Seed Data)
│   │   └── application.properties # Supabase PostgreSQL connection
│   └── pom.xml
└── frontend/                      # React 19 + TypeScript + Vite + Tailwind
    ├── src/
    │   ├── api/                   # Axios HTTP client with JWT interceptors
    │   ├── components/            # Navbar, Footer, CartDrawer, ProductCard, UI
    │   ├── hooks/                 # Custom reactive hooks
    │   ├── pages/                 # Home, Products, ProductDetail, Auth, Orders, Admin
    │   ├── store/                 # Zustand persisted state (authStore, cartStore)
    │   └── utils/supabase/        # Supabase browser helpers
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21** LTS
- **Node.js 18+** & npm
- **Apache Maven 3.9+** (or use included `mvnw.cmd`)
- **PostgreSQL / Supabase** account

---

### 1. Database Setup

The backend uses **Supabase PostgreSQL** with automated Flyway migrations.
Configure `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://<your-db-host>:5432/postgres?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=<your-db-password>
```

When you start the backend, Flyway automatically runs:
- `V1__Initial_Schema.sql` (Creates `users`, `categories`, `products`, `carts`, `cart_items`, `orders`, `order_items`)
- `V2__Seed_Data.sql` (Seeds initial catalog, categories, and inventory)
- `AdminInitializer` (Ensures default admin account is created)

---

### 2. Backend Setup & Run

```bash
cd backend

# Run automated test suite (15 tests)
./mvnw.cmd test

# Start the Spring Boot application on port 8080
./mvnw.cmd spring-boot:run
```

Backend will be available at: `http://localhost:8080/api`

---

### 3. Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

Frontend will be available at: `http://127.0.0.1:5173/`

---

## 🔑 Default Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@shopsphere.com` | `Admin@123456` | Full Admin Dashboard & Inventory CRUD |
| **Customer** | `customer1@example.com` | `Customer@123` | Browsing, Cart, Checkout, Order Tracking |

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/products` | Public | List paginated products with filters |
| `GET` | `/api/products/{id}` | Public | Get product details by ID |
| `GET` | `/api/products/featured` | Public | Retrieve featured products |
| `GET` | `/api/categories` | Public | List all active categories |
| `GET` | `/api/cart` | Authenticated | Get current user's active cart |
| `POST` | `/api/cart/items` | Authenticated | Add product to cart |
| `PUT` | `/api/cart/items/{id}` | Authenticated | Update cart item quantity |
| `DELETE` | `/api/cart/items/{id}` | Authenticated | Remove item from cart |
| `POST` | `/api/orders/checkout` | Authenticated | Place order with address |
| `GET` | `/api/orders` | Authenticated | List order history for customer |
| `GET` | `/api/orders/{id}` | Authenticated | Get specific order tracking details |
| `GET` | `/api/admin/stats` | Admin | Real-time sales, order, & inventory KPIs |
| `POST` | `/api/admin/products` | Admin | Create new catalog item |
| `PUT` | `/api/admin/products/{id}` | Admin | Edit existing product |
| `DELETE`| `/api/admin/products/{id}` | Admin | Deactivate product |
| `GET` | `/api/admin/orders` | Admin | List all platform orders |
| `PATCH`| `/api/admin/orders/{id}/status` | Admin | Transition order status |

---

## 🧪 Testing

The backend includes full integration tests using H2 in-memory profile and AssertJ:

```bash
cd backend
./mvnw.cmd test
```

Results: **15 tests run, 0 failures, 0 errors**

---

## 📄 License

This project is licensed under the MIT License.
