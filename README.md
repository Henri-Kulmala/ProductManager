# Product Manager – Full-Stack Application


## Table of contents

1. [Description](#description)
2. [Application Security](#application-security)
3. [Database](#database)
4. [Code Stack](#code-stack)
5. [User Manual & Initialization](#user-manual--initialization)




---

## Description
<details>
<summary><strong>Click to expand</strong></summary>

**ProductManager** is a full-stack web application for managing and publishing structured product information.  
The project was designed as a lightweight and secure admin interface that allows the creation, modification, and deletion of product data stored in a cloud database. This data is then used to output a list of products for customers to view.

### Key Features
- Modern React + Vite **frontend** for a responsive admin panel  
- Secure **Next.js (App Router)** API backend  
- Cloud-hosted **PostgreSQL database (Neon)** via Prisma ORM  
- **Supabase authentication** for admin access  
- Fully CORS-protected **REST API** with granular access control  
- Deployed on **Render (API)** and **cPanel (Frontend)**  

The system enables small businesses or internal teams to manage product data without needing a full CMS (content management system).

### Project root directory (unfinished)

```
├── product-manager-admin
  ├── src
    ├── assets
      ├── fonts
    ├── components
      ├── ProductForm.tsx
      ├── ProductsTable.tsx
    ├── lib
      ├── api.ts
      ├── auth.ts
      ├── supabase.ts
      ├── validation.ts
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── MainApp.tsx
    ├── types.ts

├── product-manager-api
  ├── lib
  ├── prisma
    ├── migrations
      ├── 20251029141613_init
  ├── src
    ├── app
      ├── api
├── product-manager-front
  ├── public
  ├── src
    ├── assets
      ├── fonts
      ├── Logos
    ├── components
    ├── lib
```
### Interface snapshots (coming soon)

<details>
<summary><strong>View snapshots</strong></summary> 

### Admin panel (product-manager-admin)
The admin panel website lets the admin user perform useful functions, such as creating new products, deleting and editing the existing products. These are all then updated onto the product listing page (product-manager-front) visible for the customer.

#### Login page
![alt](url)

#### Landing page
Here you can see the landing page for the admin panel. 
![alt](url)

#### Creating a new product
![alt](url)

### Product listing page

#### Landing page
![alt](url)

#### opened product card
![alt](url)

</details>

</details>

---

##  Application Security
<details>
<summary><strong>Click to expand</strong></summary>

The project emphasizes security both at the application and infrastructure level.

### Authentication & Authorization
- Uses **Supabase Auth** with email-password authentication.
- All API routes are protected by a server-side verification of the Supabase access token.
- Session tokens are stored securely in the client’s local storage and transmitted via HTTPS.

### CORS Policy
- Strict `Access-Control-Allow-Origin` enforcement using environment variables (`ADMIN_ORIGIN` or `ADMIN_ORIGINS`).
- Only pre-defined admin frontend domains are permitted to communicate with the API.
- OPTIONS preflight requests are handled server-side to ensure browser compliance.

### Environment Variables
Sensitive keys and database credentials are **never committed to version control**.  
They are defined through Render’s **Environment Variables** interface:
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_ORIGIN=https://admin.example.com
NODE_ENV=production
```

### Data Protection
- Neon’s PostgreSQL instance enforces **TLS (SSL)** connections (`sslmode=require`).
- Supabase tokens and Prisma connections are stored only in secure server memory.
- No personal data or payment data is stored in this application — only product metadata.

</details>

---

##  Database
<details>
<summary><strong>Click to expand</strong></summary>

### Chosen Service: **Neon (PostgreSQL)**

The database is hosted on **[Neon.tech](https://neon.tech)** — a managed PostgreSQL service providing:
- Persistent **Free Tier** (0.5 GB storage, 1 project)
- Automatic **SSL/TLS encryption**
- **EU region** data residency (GDPR compliant)
- Seamless integration with **Prisma ORM** and **Render**
- Instant branch creation for testing and rollback

### Schema Management
- Database schema is defined in `prisma/schema.prisma`
- Migrations handled by:
  ```bash
  npx prisma migrate deploy
  ```
- Prisma Client is auto-generated during the build process (`postinstall` script).

### Example Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  ingredients String?
  allergens   String?
  photoUrl    String?
  size        String?
  price       Float?
  EAN         String?
  createdAt   DateTime @default(now())
}
```

</details>

---

##  Code Stack
<details>
<summary><strong>Click to expand</strong></summary>

### Code stack and services used in the project

[![Code Stack](https://skillicons.dev/icons?i=ts,html,css,react,vite,nodejs,supabase,prisma)](https://skillicons.dev)

### Frontend
| Technology | Purpose |
|-------------|----------|
| **Vite + React (TypeScript)** | High-performance single-page admin panel |
| **React Query** | Client-side caching and mutations |
| **Supabase JS SDK** | Authentication client |
| **TailwindCSS / Custom CSS** | Styling and responsive layout |

### Backend
| Technology | Purpose |
|-------------|----------|
| **Next.js 15 (App Router)** | API routes and server runtime |
| **Prisma ORM** | PostgreSQL connection management |
| **Supabase Auth (server SDK)** | Token validation |
| **Render Web Service** | API deployment environment |
| **Node.js 18+** | Runtime environment |
| **Zod** | Input validation for all API payloads |

### Deployment Overview
| Component | Platform | Notes |
|------------|-----------|-------|
| Frontend | **cPanel (Apache)** | Deployed as static Vite build (`/dist`) |
| Backend | **Render Web Service** | Runs `next start -p $PORT` |
| Database | **Neon (PostgreSQL)** | SSL-secured free tier |
| Auth | **Supabase** | Password-based email login |

</details>

---

##  User Manual & Initialization
<details>
<summary><strong>Click to expand</strong></summary>

### 1. Clone and install
```bash
git clone https://github.com/yourusername/product-manager.git
cd product-manager
npm install
```

### 2. Environment setup
Create `.env.local` in the **backend**:
```env
DATABASE_URL=postgresql://user:password@ep-neon-db-url/neondb
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
ADMIN_ORIGIN=http://localhost:5173
```

Create `.env` in the **frontend**:
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=anon-key
```

### 3. Run locally
In two terminals:
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd product-manager-admin
npm run dev
```
Open: **http://localhost:5173**

### 4. Deployment
**Backend:**  
Render → New Web Service → Connect repository →  
Build command: `npm ci && npm run build`  
Start command: `npm run start`  

**Frontend:**  
Build locally then upload `/dist` to your cPanel document root:
```bash
npm run build
```

### 5. Usage
- Log in using your Supabase credentials.  
- Manage products: *Add*, *Edit*, *Delete*, *Search*.  
- Data syncs automatically with the Neon database via the Render API.

</details>

---


