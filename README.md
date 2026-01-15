# Product Manager – Full-Stack Application


## Table of contents

1. [Description](#description)
2. [Application Security](#architecture-overview)
3. [Interface snapshots](#-interface-snapshots)
4. [Application Security](#application-security)
5. [Database](#database)
6. [API endpoints](#api-endpoints)
7. [Code Stack](#code-stack)
8. [Local Development & Deployment](#local-development--deployment)




---

## Description


**Product Manager** is a full-stack web application for managing and publishing structured product information.  
The project was built as a lightweight alternative to a full CMS, focusing on **clarity, performance, and operational reliability**.

The system allows an admin user to manage product data through a dedicated admin panel, while exposing a **read-only public product listing API** for customer-facing use.

The solution is designed to work reliably in **traditional hosting environments** (cPanel / Passenger), without requiring container-based platforms or heavy ORM tooling.

---

## Architecture Overview

The system consists of three separate applications:

- **product-manager-api**  
  Next.js (App Router) API backend

- **product-manager-admin**  
  React + Vite admin interface for product management

- **product-manager-front**  
  Public-facing product listing site consuming a read-only API

All applications communicate via HTTP APIs and share a single MySQL database.

---

###  📷 Interface snapshots 

<details>
<summary><strong>View snapshots</strong></summary> 

### Admin panel (product-manager-admin)
The admin panel website lets the admin user perform useful functions, such as creating new products, deleting and editing the existing products. These are all then updated onto the product listing page (product-manager-front) visible for the customer.

#### Login page
![alt](https://github.com/Henri-Kulmala/ProductManager/blob/main/snapshots/Login-page.jpg)

#### Landing page
Here you can see the landing page for the admin panel. 
![alt](https://github.com/Henri-Kulmala/ProductManager/blob/main/snapshots/Tuotehallinta%20etusivu.jpg)

#### Creating a new product
![alt](https://github.com/Henri-Kulmala/ProductManager/blob/main/snapshots/Tuotteen%20lis%C3%A4ys.jpg)

### Product listing page

#### Landing page
![alt](https://github.com/Henri-Kulmala/ProductManager/blob/main/snapshots/Tuotelistaus.jpg)

#### opened product card
![alt](https://github.com/Henri-Kulmala/ProductManager/blob/main/snapshots/Tuotekortti%20avattuna.jpg)

</details>



---

## Application Security

### Authentication & Authorization

- Admin access is protected using **Basic Authentication**
- Successful login creates a **server-side session**, stored and verified via secure cookies
- All admin API routes require a valid session

### Public Access

- A dedicated **public API endpoint** is exposed for product listing
- Public endpoints are **read-only** and do not require authentication
- No admin or mutation routes are accessible without a session

### CORS Policy

- Admin API routes allow requests only from explicitly defined admin origins
- Public API routes allow cross-origin GET requests
- Preflight (`OPTIONS`) requests are handled explicitly

### Environment Variables

Sensitive values are never committed to version control.

Example backend environment variables:

```env
DATABASE_URL=mysql://user:password@localhost:3306/database
SESSION_SECRET=super-secret-string
ADMIN_ORIGINS=https://admin.example.com,http://localhost:5173
NODE_ENV=production
```

---

## Database

### Chosen Database: **MySQL (cPanel)**

The application uses a MySQL database provisioned via **cPanel**.

Reasons for this choice:

- Native availability in shared hosting environments
- No external dependencies
- Predictable performance and behavior

### Query Layer: **Kysely**

Database access is implemented using **Kysely**, a TypeScript SQL query builder.

Key benefits:

- Fully type-safe SQL queries
- No runtime query engine or native binaries
- Direct control over SQL behavior
- Excellent compatibility with cPanel / Passenger

### Schema Management

- Database schema is managed manually (SQL)
- No ORM migrations or generated clients
- Schema changes are explicit and transparent

Example table:

```sql
CREATE TABLE Product (
  id VARCHAR(191) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  ingredients TEXT NULL,
  allergens TEXT NULL,
  size VARCHAR(191) NULL,
  price VARCHAR(191) NULL,
  EAN VARCHAR(191) NULL,
  photoUrl TEXT NULL,
  producer VARCHAR(191) NULL,
  producedIn VARCHAR(191) NULL,
  ECodes TEXT NULL,
  preservation TEXT NULL,
  energia VARCHAR(191) NULL,
  rasva VARCHAR(191) NULL,
  hiilarit VARCHAR(191) NULL,
  sokerit_yht VARCHAR(191) NULL,
  sokerit_lis VARCHAR(191) NULL,
  proteiini VARCHAR(191) NULL,
  suola VARCHAR(191) NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

---

## API Endpoints

### Authenticated (Admin only)

| Method | Endpoint | Description |
|------|--------|-------------|
| POST | `/api/auth/login` | Login (BasicAuth → session cookie) |
| POST | `/api/auth/logout` | Logout and destroy session |
| GET | `/api/auth/me` | Get current authenticated user |
| GET | `/api/products` | List products (admin view) |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/bulk` | Bulk import products |

All routes above require a valid session.

---

### Public (Unauthenticated)

| Method | Endpoint | Description |
|------|--------|-------------|
| GET | `/api/public/products` | Public product listing (read-only) |

This endpoint is consumed by **product-manager-front** and is safe to expose publicly.

---

## Code Stack

### Frontend (Admin)

- React
- Vite
- TypeScript
- React Query
- Zod
- Custom CSS

### Frontend (Public)

- React
- Vite
- TypeScript
- Static product listing UI

### Backend

- Next.js (App Router)
- Node.js
- Kysely
- MySQL
- Zod (validation)

### Deployment

| Component | Platform |
|--------|---------|
| API | cPanel / Passenger (Node.js app) |
| Admin UI | cPanel (static Vite build) |
| Public UI | cPanel (static Vite build) |
| Database | cPanel MySQL |

---

## Local Development & Deployment

### Install dependencies

```bash
npm install
```

### Run locally

```bash
# Backend
cd product-manager-api
npm run dev

# Admin UI
cd product-manager-admin
npm run dev

# Public UI
cd product-manager-front
npm run dev
```

### Deployment (cPanel)

- Backend deployed as **Next.js standalone build**
- Static frontends deployed via Vite `/dist`
- Environment variables configured in **cPanel → Setup Node.js App**

---

## Summary

This project demonstrates a **deliberate architectural choice** to prioritize:

- Operational stability
- Type safety without heavy ORM tooling
- Compatibility with traditional hosting
- Clear separation between admin and public access

It is intentionally simple, explicit, and production-focused.



