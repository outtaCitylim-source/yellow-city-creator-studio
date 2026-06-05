# System Architecture — Yellow City Creator Studio

Overview of the system design, components, and data flow.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet Users                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel CDN/Edge                           │
│                  (HTTPS, Caching)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Frontend   │  │  API Routes  │  │   Static    │
│   (React)    │  │  (Functions) │  │   Assets    │
└──────────────┘  └──────┬───────┘  └──────────────┘
        │                │
        └────────────────┼────────────────┐
                         │                │
                         ▼                ▼
                   ┌──────────────┐  ┌──────────────┐
                   │  PostgreSQL  │  │   S3/Cloud   │
                   │  Database    │  │   Storage    │
                   └──────────────┘  └──────────────┘
```

---

## Frontend Architecture

### Technology Stack
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** CSS with Tailwind (future)
- **State Management:** React Context + Hooks
- **Routing:** Wouter
- **HTTP Client:** Fetch API

### Directory Structure
```
src/
├── pages/              # Page components
│   ├── Home.jsx       # Public landing page
│   ├── Login.jsx      # Authentication
│   ├── Dashboard.jsx  # Main dashboard
│   ├── Orders.jsx     # Order management
│   ├── Customers.jsx  # Customer CRM
│   ├── Inventory.jsx  # Inventory tracker
│   └── Quotes.jsx     # Quote builder
├── components/        # Reusable components
│   ├── OrderCard.jsx
│   ├── CustomerForm.jsx
│   └── ...
├── contexts/          # React contexts
│   └── AuthContext.jsx
├── hooks/             # Custom hooks
│   └── useApi.js
├── utils/             # Utilities
│   └── api.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
useApi() Hook / API Call
    ↓
Fetch Request to Backend
    ↓
Backend Response
    ↓
State Update (React)
    ↓
Component Re-render
    ↓
Updated UI
```

### Authentication Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Backend validates & returns JWT token
   ↓
4. Frontend stores token in localStorage
   ↓
5. All subsequent requests include token in Authorization header
   ↓
6. Backend verifies token for protected routes
```

---

## Backend Architecture

### Technology Stack
- **Runtime:** Node.js 18+
- **Framework:** Vercel Functions (serverless)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** PBKDF2

### Directory Structure
```
api/
├── auth/              # Authentication endpoints
│   ├── login.js
│   └── logout.js
├── orders/            # Order management
│   ├── list.js
│   ├── create.js
│   └── update.js
├── customers/         # Customer management
│   ├── list.js
│   └── create.js
├── inventory/         # Inventory management
│   └── list.js
├── quotes/            # Quote management
│   └── create.js
├── utils/             # Utility functions
│   ├── db.js         # Database connection
│   ├── jwt.js        # JWT utilities
│   ├── password.js   # Password hashing
│   ├── middleware.js # Express middleware
│   └── validation.js # Input validation
├── migrations/        # Database migrations
│   ├── init.sql      # Schema
│   └── run.js        # Migration runner
└── seed.js           # Sample data seeder
```

### Request Processing Pipeline

```
Incoming Request
    ↓
CORS Preflight Check
    ↓
Method Validation
    ↓
Content-Type Validation
    ↓
Rate Limiting Check
    ↓
JWT Token Verification
    ↓
Input Validation
    ↓
Database Query
    ↓
Response Formatting
    ↓
Send Response
```

### Error Handling

```
Error Occurs
    ↓
Catch Block
    ↓
Log Error (with context)
    ↓
Format Error Response
    ↓
Send Error Response (no sensitive data in production)
```

---

## Database Architecture

### Technology Stack
- **Database:** PostgreSQL 14+
- **Connection Pooling:** pg-pool
- **Migrations:** Manual SQL scripts
- **Backup:** Provider-managed (Vercel Postgres, Neon, Railway)

### Schema Overview

```
Users
├── id (PK)
├── email (UNIQUE)
├── password_hash
├── name
├── role (admin, staff, user)
└── created_at

Customers
├── id (PK)
├── name
├── email
├── phone
├── segment (Walk-in, Team, Business, Graduation, Event)
└── created_at

Orders
├── id (PK)
├── order_number (UNIQUE)
├── customer_id (FK)
├── status (New, Proof Sent, In Production, Quality Check, Ready, Picked Up)
├── total_price
├── deadline
└── created_at

OrderItems
├── id (PK)
├── order_id (FK)
├── product
├── technique (DTF, DTG, Embroidery, Garment Wash)
├── quantity
└── price

Inventory
├── id (PK)
├── sku (UNIQUE)
├── item_name
├── color
├── size
├── stock_level
├── reorder_threshold
└── unit_price

Quotes
├── id (PK)
├── customer_id (FK)
├── technique
├── quantity
├── estimated_price
├── status (Draft, Sent, Accepted, Rejected)
└── created_at

POSTransactions
├── id (PK)
├── customer_id (FK)
├── total_amount
├── items
└── created_at

KioskSubmissions
├── id (PK)
├── customer_name
├── customer_email
├── customer_phone
├── service_type
├── status
└── created_at

Techniques
├── id (PK)
├── name (DTF, DTG, Embroidery, Garment Wash)
└── description
```

### Relationships

```
Users (1) ──→ (Many) Orders
Users (1) ──→ (Many) Quotes

Customers (1) ──→ (Many) Orders
Customers (1) ──→ (Many) Quotes
Customers (1) ──→ (Many) POSTransactions

Orders (1) ──→ (Many) OrderItems
OrderItems (Many) ──→ (1) Techniques

Inventory (1) ──→ (Many) OrderItems
```

---

## Authentication & Authorization

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": 1,
  "email": "admin@yellowcity.local",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234654290
}

Signature:
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), JWT_SECRET)
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| admin | All operations (create, read, update, delete) |
| staff | Read orders, customers, inventory; create orders; update order status |
| user | Read own data only |

### Protected Routes

```javascript
// Admin only
GET /api/admin/settings
POST /api/admin/users

// Staff and above
GET /api/orders
POST /api/orders
PATCH /api/orders/:id

// Authenticated users
GET /api/customers/:id
```

---

## Deployment Architecture

### Vercel Deployment

```
GitHub Repository
    ↓
Push to main branch
    ↓
Vercel Webhook Trigger
    ↓
Build Process
├── npm install
├── npm run build
└── Generate dist/
    ↓
Deploy to Vercel Edge Network
├── Frontend (React SPA)
├── API Functions (Node.js)
└── Static Assets
    ↓
Assign HTTPS Domain
    ↓
Live at: https://your-domain.vercel.app
```

### Environment Configuration

```
Development (.env.local)
├── DATABASE_URL: local PostgreSQL
├── JWT_SECRET: dev secret
└── NODE_ENV: development

Production (Vercel Dashboard)
├── DATABASE_URL: cloud PostgreSQL
├── JWT_SECRET: strong random secret
└── NODE_ENV: production
```

---

## Data Flow Examples

### Order Creation Flow

```
1. User fills order form in frontend
   ↓
2. Form validation in frontend
   ↓
3. POST /api/orders with order data
   ↓
4. Backend receives request
   ↓
5. JWT token verification
   ↓
6. Input validation (customer_id, status, price)
   ↓
7. Database INSERT into orders table
   ↓
8. Return created order with id
   ↓
9. Frontend receives response
   ↓
10. Update local state
   ↓
11. Show success message
   ↓
12. Redirect to order details
```

### Order Status Update Flow

```
1. User clicks "Mark as In Production" button
   ↓
2. PATCH /api/orders/1 { status: "In Production" }
   ↓
3. Backend verifies user is staff or admin
   ↓
4. Validate new status is valid
   ↓
5. Database UPDATE orders SET status = 'In Production'
   ↓
6. Return updated order
   ↓
7. Frontend updates order card in real-time
   ↓
8. Show updated status
```

### Customer Search Flow

```
1. User types in customer search box
   ↓
2. Debounce input (500ms)
   ↓
3. GET /api/customers?segment=Business&limit=10
   ↓
4. Backend queries database
   ↓
5. Return matching customers
   ↓
6. Frontend displays dropdown
   ↓
7. User selects customer
   ↓
8. Populate order form with customer data
```

---

## Scalability Considerations

### Current Limits
- PostgreSQL: Single instance (sufficient for 10k+ orders/month)
- API: Vercel auto-scales (handles 1000+ concurrent users)
- Frontend: CDN-cached (global distribution)

### When to Scale

| Metric | Threshold | Action |
|--------|-----------|--------|
| Database CPU | >80% | Upgrade PostgreSQL tier |
| Database Storage | >80% | Increase storage quota |
| API Response Time | >500ms | Add database indexes |
| Concurrent Users | >5000 | Consider caching layer |

### Optimization Strategies

1. **Database**
   - Add indexes on frequently queried columns
   - Archive old orders (>1 year)
   - Implement query caching

2. **API**
   - Add response caching headers
   - Implement pagination (already done)
   - Use database connection pooling (already done)

3. **Frontend**
   - Lazy load components
   - Implement virtual scrolling for large lists
   - Use service workers for offline support

---

## Security Architecture

### Defense Layers

```
Layer 1: Network
├── HTTPS/TLS encryption
├── Vercel DDoS protection
└── Rate limiting

Layer 2: Application
├── JWT authentication
├── Input validation
├── SQL injection prevention
└── CORS restrictions

Layer 3: Database
├── SSL connection
├── Password hashing (PBKDF2)
├── Least privilege access
└── Automated backups

Layer 4: Secrets
├── Environment variables
├── No hardcoded secrets
├── Regular rotation
└── Access control
```

---

## Monitoring & Observability

### Key Metrics

```
Application
├── Response time (target: <500ms)
├── Error rate (target: <0.1%)
├── Request volume
└── Active users

Database
├── Query performance
├── Connection pool usage
├── Storage usage
└── Backup status

Infrastructure
├── CPU usage
├── Memory usage
├── Disk usage
└── Uptime
```

### Logging

```
Frontend Logs
├── Page views
├── User interactions
├── Errors
└── Performance metrics

Backend Logs
├── Request/response
├── Database queries
├── Errors
└── Authentication events
```

---

## Future Enhancements

### Phase 2
- [ ] Real-time order updates (WebSockets)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Payment processing (Stripe)

### Phase 3
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Machine learning recommendations
- [ ] Multi-location support

### Phase 4
- [ ] API marketplace
- [ ] Third-party integrations
- [ ] Custom workflows
- [ ] White-label support

---

**Last Updated:** 2024
**Architecture Version:** 1.0
