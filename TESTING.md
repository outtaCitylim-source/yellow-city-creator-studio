# Testing Guide — Yellow City Creator Studio

Comprehensive testing strategies for frontend, backend, and integration testing.

---

## Testing Strategy

### Test Pyramid

```
        /\
       /  \
      /Unit\
     /Tests \
    /________\
    /\      /\
   /  \    /  \
  / Int\  /Inte\
 /egrat\/ grat \
/________\Tests_\
/\      /\      /\
/  \    /  \    /  \
/ E2E \/ E2E \/ E2E \
/Tests \Tests \Tests \
/________\________\________\
```

**Recommended Distribution:**
- Unit Tests: 70% (fast, isolated)
- Integration Tests: 20% (API, database)
- E2E Tests: 10% (full user flows)

---

## Unit Testing

### Frontend Unit Tests

```javascript
// src/components/__tests__/OrderCard.test.jsx
import { render, screen } from '@testing-library/react';
import OrderCard from '../OrderCard';

describe('OrderCard', () => {
  it('displays order number', () => {
    const order = { id: 1, order_number: 'ORD-001', status: 'New' };
    render(<OrderCard order={order} />);
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
  });

  it('displays order status', () => {
    const order = { id: 1, order_number: 'ORD-001', status: 'In Production' };
    render(<OrderCard order={order} />);
    expect(screen.getByText('In Production')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const order = { id: 1, order_number: 'ORD-001', status: 'New' };
    const handleClick = vi.fn();
    render(<OrderCard order={order} onClick={handleClick} />);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledWith(order);
  });
});
```

### Backend Unit Tests

```javascript
// api/utils/__tests__/validation.test.js
import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateOrderStatus,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('accepts valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts strong passwords', () => {
      const result = validatePassword('SecurePass123');
      expect(result.valid).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(validatePassword('short').valid).toBe(false);
      expect(validatePassword('nouppercase123').valid).toBe(false);
      expect(validatePassword('NONUMBERS').valid).toBe(false);
    });
  });

  describe('validateOrderStatus', () => {
    it('accepts valid statuses', () => {
      expect(validateOrderStatus('New')).toBe(true);
      expect(validateOrderStatus('In Production')).toBe(true);
      expect(validateOrderStatus('Picked Up')).toBe(true);
    });

    it('rejects invalid statuses', () => {
      expect(validateOrderStatus('Invalid')).toBe(false);
      expect(validateOrderStatus('pending')).toBe(false);
    });
  });
});
```

---

## Integration Testing

### API Integration Tests

```javascript
// api/__tests__/orders.integration.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';
let authToken;

describe('Orders API Integration', () => {
  beforeAll(async () => {
    // Login to get token
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@yellowcity.local',
        password: 'admin123',
      }),
    });
    const data = await response.json();
    authToken = data.token;
  });

  it('fetches orders list', async () => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  it('creates new order', async () => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        customer_id: 1,
        order_number: 'ORD-TEST-001',
        status: 'New',
        total_price: 99.99,
      }),
    });
    expect(response.status).toBe(201);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.order_number).toBe('ORD-TEST-001');
  });

  it('rejects invalid order data', async () => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        customer_id: 'invalid',
        order_number: '',
      }),
    });
    expect(response.status).toBe(400);
  });

  it('requires authentication', async () => {
    const response = await fetch(`${API_URL}/orders`);
    expect(response.status).toBe(401);
  });
});
```

---

## End-to-End Testing

### E2E Test with Playwright

```javascript
// e2e/dashboard.spec.js
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:5173');
    
    // Login
    await page.fill('input[type="email"]', 'admin@yellowcity.local');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Login")');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard');
  });

  test('displays dashboard overview', async ({ page }) => {
    // Check for key elements
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Open Orders')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
  });

  test('navigates to orders page', async ({ page }) => {
    await page.click('a:has-text("Orders")');
    await page.waitForURL('**/orders');
    
    await expect(page.locator('h1')).toContainText('Orders');
    await expect(page.locator('.order-card')).toHaveCount(5); // Assuming 5 orders
  });

  test('creates new order', async ({ page }) => {
    await page.click('button:has-text("New Order")');
    await page.waitForURL('**/orders/new');
    
    // Fill form
    await page.selectOption('select[name="customer"]', '1');
    await page.fill('input[name="order_number"]', 'ORD-E2E-001');
    await page.fill('input[name="total_price"]', '99.99');
    
    // Submit
    await page.click('button:has-text("Create Order")');
    
    // Verify success
    await expect(page.locator('text=Order created successfully')).toBeVisible();
    await expect(page.locator('text=ORD-E2E-001')).toBeVisible();
  });

  test('filters orders by status', async ({ page }) => {
    await page.click('a:has-text("Orders")');
    await page.selectOption('select[name="status"]', 'In Production');
    
    // Verify only "In Production" orders are shown
    const cards = page.locator('.order-card');
    for (let i = 0; i < await cards.count(); i++) {
      const status = await cards.nth(i).locator('.status').textContent();
      expect(status).toBe('In Production');
    }
  });
});
```

---

## Performance Testing

### Load Testing with k6

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m30s', target: 20 }, // Stay at 20
    { duration: '30s', target: 0 },    // Ramp down
  ],
};

export default function () {
  // Login
  const loginRes = http.post('https://your-app.vercel.app/api/auth/login', {
    email: 'admin@yellowcity.local',
    password: 'admin123',
  });

  const token = loginRes.json('token');

  // Get orders
  const ordersRes = http.get('https://your-app.vercel.app/api/orders', {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(ordersRes, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

Run: `k6 run k6/load-test.js`

---

## Security Testing

### OWASP ZAP Scanning

```bash
# Run security scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://your-app.vercel.app \
  -r security-report.html

# Review report for vulnerabilities
```

### Dependency Vulnerability Scanning

```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Use Snyk for continuous monitoring
npx snyk test
npx snyk monitor
```

---

## Running Tests

### Setup

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test
npm install --save-dev k6

# Create test directories
mkdir -p src/components/__tests__
mkdir -p api/__tests__
mkdir -p e2e
mkdir -p k6
```

### Run Tests

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npx playwright test

# E2E tests with UI
npx playwright test --ui

# Load testing
k6 run k6/load-test.js

# Security scan
npm audit
npx snyk test
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - run: npx playwright install
      - run: npx playwright test
      - run: npm audit
```

---

## Test Coverage Goals

| Category | Target |
|----------|--------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

---

## Common Test Scenarios

### Authentication

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout clears token
- [ ] Expired token redirects to login
- [ ] Missing token returns 401

### Orders

- [ ] Create order with valid data
- [ ] Create order with invalid data
- [ ] Update order status
- [ ] Delete order
- [ ] Filter orders by status
- [ ] Filter orders by date range

### Customers

- [ ] Create customer
- [ ] Update customer
- [ ] Delete customer
- [ ] Filter by segment
- [ ] View customer order history

### Inventory

- [ ] Add inventory item
- [ ] Update stock level
- [ ] Delete inventory item
- [ ] Show low stock items
- [ ] Reorder threshold alerts

---

## Debugging Failed Tests

```bash
# Run single test file
npm run test -- api/__tests__/orders.integration.test.js

# Run with verbose output
npm run test -- --reporter=verbose

# Debug with breakpoints
node --inspect-brk ./node_modules/vitest/vitest.mjs run

# E2E debugging
npx playwright test --debug
```

---

## Resources

- **Vitest:** https://vitest.dev
- **Testing Library:** https://testing-library.com
- **Playwright:** https://playwright.dev
- **k6:** https://k6.io
- **OWASP ZAP:** https://www.zaproxy.org

---

**Last Updated:** 2024
**Review Frequency:** Quarterly
