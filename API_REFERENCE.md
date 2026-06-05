# API Reference — Yellow City Creator Studio

Complete documentation of all backend API endpoints.

---

## Base URL

```
Development: http://localhost:5173/api
Production: https://your-domain.vercel.app/api
```

---

## Authentication

All endpoints (except login) require a JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Get Token

```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yellowcity.local",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@yellowcity.local",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    "field": ["Error detail"]
  }
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Endpoints

### Authentication

#### Login
```
POST /auth/login
```

**Request:**
```json
{
  "email": "admin@yellowcity.local",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@yellowcity.local",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Errors:**
- 400: Invalid email or password format
- 401: Invalid credentials

---

#### Logout
```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Orders

#### List Orders
```
GET /orders?status=New&limit=50&offset=0
```

**Query Parameters:**
- `status` (optional): Filter by status (New, Proof Sent, In Production, Quality Check, Ready, Picked Up)
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-001",
        "customer_id": 1,
        "status": "New",
        "total_price": 99.99,
        "deadline": "2024-12-31T00:00:00Z",
        "created_at": "2024-06-01T10:00:00Z",
        "updated_at": "2024-06-01T10:00:00Z"
      }
    ],
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### Get Order by ID
```
GET /orders/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-001",
    "customer_id": 1,
    "status": "New",
    "total_price": 99.99,
    "deadline": "2024-12-31T00:00:00Z",
    "items": [
      {
        "id": 1,
        "product": "T-Shirt",
        "color": "Black",
        "size": "M",
        "quantity": 10,
        "technique": "DTF",
        "placement": "Front",
        "price": 99.99
      }
    ],
    "created_at": "2024-06-01T10:00:00Z",
    "updated_at": "2024-06-01T10:00:00Z"
  }
}
```

---

#### Create Order
```
POST /orders
```

**Request:**
```json
{
  "customer_id": 1,
  "order_number": "ORD-002",
  "status": "New",
  "total_price": 150.00,
  "deadline": "2024-12-31T00:00:00Z",
  "notes": "Rush order"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "order_number": "ORD-002",
    "customer_id": 1,
    "status": "New",
    "total_price": 150.00,
    "created_at": "2024-06-01T11:00:00Z"
  }
}
```

**Errors:**
- 400: Invalid customer_id, order_number, or status
- 403: Insufficient permissions (staff can only create, not edit)

---

#### Update Order Status
```
PATCH /orders/:id
```

**Request:**
```json
{
  "status": "In Production"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "In Production",
    "updated_at": "2024-06-01T12:00:00Z"
  }
}
```

---

### Customers

#### List Customers
```
GET /customers?segment=Business&limit=50&offset=0
```

**Query Parameters:**
- `segment` (optional): Filter by segment (Walk-in, Team, Business, Graduation, Event)
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "555-1234",
        "segment": "Business",
        "total_orders": 5,
        "total_spent": 1250.00,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 25,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### Get Customer by ID
```
GET /customers/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "segment": "Business",
    "total_orders": 5,
    "total_spent": 1250.00,
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-001",
        "status": "Picked Up",
        "total_price": 99.99,
        "created_at": "2024-06-01T00:00:00Z"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### Create Customer
```
POST /customers
```

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "555-5678",
  "segment": "Team"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "555-5678",
    "segment": "Team",
    "created_at": "2024-06-01T00:00:00Z"
  }
}
```

---

### Inventory

#### List Inventory
```
GET /inventory?low_stock=true&limit=50&offset=0
```

**Query Parameters:**
- `low_stock` (optional): Show only items below reorder threshold
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "sku": "TS-BLK-M",
        "item_name": "T-Shirt Black Medium",
        "color": "Black",
        "size": "M",
        "stock_level": 45,
        "reorder_threshold": 50,
        "unit_price": 12.99,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### Get Inventory Item by SKU
```
GET /inventory/:sku
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "TS-BLK-M",
    "item_name": "T-Shirt Black Medium",
    "color": "Black",
    "size": "M",
    "stock_level": 45,
    "reorder_threshold": 50,
    "unit_price": 12.99,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### Update Inventory Stock
```
PATCH /inventory/:sku
```

**Request:**
```json
{
  "stock_level": 100,
  "reorder_threshold": 50
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sku": "TS-BLK-M",
    "stock_level": 100,
    "updated_at": "2024-06-01T00:00:00Z"
  }
}
```

---

### Quotes

#### List Quotes
```
GET /quotes?status=Draft&limit=50&offset=0
```

**Query Parameters:**
- `status` (optional): Filter by status (Draft, Sent, Accepted, Rejected)
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quotes": [
      {
        "id": 1,
        "customer_id": 1,
        "technique": "DTF",
        "quantity": 50,
        "estimated_price": 500.00,
        "status": "Draft",
        "created_at": "2024-06-01T00:00:00Z"
      }
    ],
    "total": 20,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### Create Quote
```
POST /quotes
```

**Request:**
```json
{
  "customer_id": 1,
  "technique": "DTG",
  "quantity": 100,
  "estimated_price": 1000.00
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "customer_id": 1,
    "technique": "DTG",
    "quantity": 100,
    "estimated_price": 1000.00,
    "status": "Draft",
    "created_at": "2024-06-01T00:00:00Z"
  }
}
```

---

#### Update Quote Status
```
PATCH /quotes/:id
```

**Request:**
```json
{
  "status": "Sent"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "Sent",
    "updated_at": "2024-06-01T00:00:00Z"
  }
}
```

---

## Rate Limiting

API is rate limited to **100 requests per minute** per IP address.

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

**When Rate Limited (429):**
```json
{
  "success": false,
  "error": "Too many requests",
  "retryAfter": 60000
}
```

---

## Pagination

List endpoints support pagination:

```
GET /orders?limit=50&offset=100
```

**Response includes:**
```json
{
  "data": [...],
  "total": 1500,
  "limit": 50,
  "offset": 100
}
```

---

## Filtering

Supported filters vary by endpoint:

```
GET /orders?status=New&limit=50
GET /customers?segment=Business&limit=50
GET /inventory?low_stock=true&limit=50
GET /quotes?status=Draft&limit=50
```

---

## Sorting

Endpoints support sorting (future enhancement):

```
GET /orders?sort=-created_at&limit=50
GET /customers?sort=name&limit=50
```

---

## Webhooks (Future)

Planned webhook events:

- `order.created`
- `order.status_changed`
- `quote.created`
- `quote.accepted`
- `inventory.low_stock`

---

## SDK Examples

### JavaScript/Node.js

```javascript
const API_URL = 'https://your-domain.vercel.app/api';

async function getOrders(token) {
  const response = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

async function createOrder(token, orderData) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return response.json();
}
```

### Python

```python
import requests

API_URL = 'https://your-domain.vercel.app/api'

def get_orders(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{API_URL}/orders', headers=headers)
    return response.json()

def create_order(token, order_data):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}',
    }
    response = requests.post(f'{API_URL}/orders', json=order_data, headers=headers)
    return response.json()
```

---

## Support

For API issues:
1. Check this documentation
2. Review error response details
3. Check GitHub issues
4. Contact: support@yellowcity.local

---

**Last Updated:** 2024
**API Version:** 1.0
