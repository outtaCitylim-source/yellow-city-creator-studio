# Development Guide — Yellow City Creator Studio

This guide covers setting up local development environment and contributing to the project.

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/outtaCitylim-source/yellow-city-creator-studio.git
cd yellow-city-creator-studio

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Edit .env.local with your database URL
nano .env.local

# Start dev server
npm run dev

# Visit http://localhost:5173
```

---

## Project Structure

```
yellow-city-creator-studio/
├── src/                          # Frontend React code
│   ├── pages/                    # Page components
│   │   ├── Login.jsx            # Authentication page
│   │   └── ...
│   ├── components/              # Reusable components
│   ├── contexts/                # React contexts (Auth, etc)
│   ├── hooks/                   # Custom hooks (useApi, etc)
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── api/                         # Vercel Functions (backend)
│   ├── auth/                    # Authentication endpoints
│   │   ├── login.js
│   │   └── logout.js
│   ├── orders/                  # Order management endpoints
│   ├── customers/               # Customer endpoints
│   ├── inventory/               # Inventory endpoints
│   ├── quotes/                  # Quote endpoints
│   ├── migrations/              # Database migrations
│   │   ├── init.sql            # Schema definition
│   │   └── run.js              # Migration runner
│   ├── utils/                   # Backend utilities
│   │   ├── db.js               # Database connection
│   │   ├── jwt.js              # JWT utilities
│   │   ├── middleware.js       # Express middleware
│   │   └── password.js         # Password hashing
│   └── seed.js                 # Sample data seeder
├── public/                      # Static files
├── dist/                        # Build output (generated)
├── package.json                 # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── vercel.json                 # Vercel configuration
├── .env.example                # Environment template
├── README.md                   # Project overview
├── DEPLOYMENT.md               # Deployment guide
└── DEVELOPMENT.md              # This file
```

---

## Environment Setup

### 1. Install Node.js

```bash
# Check if installed
node --version  # Should be 18+
npm --version   # Should be 9+

# If not installed:
# macOS: brew install node
# Ubuntu: sudo apt-get install nodejs npm
# Windows: Download from nodejs.org
```

### 2. Install PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from postgresql.org

# Create database
createdb yellow_city_studio

# Verify
psql yellow_city_studio -c "SELECT 1"
```

### 3. Clone & Install

```bash
git clone https://github.com/outtaCitylim-source/yellow-city-creator-studio.git
cd yellow-city-creator-studio
npm install
```

### 4. Configure Environment

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local

# Required variables:
# DATABASE_URL=postgres://user:password@localhost:5432/yellow_city_studio
# JWT_SECRET=your-random-secret-key
# NODE_ENV=development
```

---

## Running the App

### Development Server

```bash
npm run dev

# Output:
# VITE v5.4.21  ready in 225 ms
# ➜  Local:   http://localhost:5173/
```

Visit http://localhost:5173 and login with:
- Email: `admin@yellowcity.local`
- Password: `admin123`

### Build for Production

```bash
npm run build

# Creates dist/ folder with optimized build
```

### Preview Production Build

```bash
npm run preview

# Serves dist/ locally at http://localhost:4173
```

---

## Database Management

### Initialize Schema

```bash
# Run migrations
node api/migrations/run.js

# Or manually
psql $DATABASE_URL < api/migrations/init.sql
```

### Seed Sample Data

```bash
# Populate with demo data
node api/seed.js

# Now login and see real data in dashboard
```

### Connect to Database

```bash
# Interactive shell
psql yellow_city_studio

# Useful commands:
psql> \dt                    # List tables
psql> \d orders              # Describe table
psql> SELECT * FROM orders;  # Query data
psql> \q                     # Quit
```

### Reset Database

```bash
# Drop and recreate
dropdb yellow_city_studio
createdb yellow_city_studio
node api/migrations/run.js
node api/seed.js
```

---

## Frontend Development

### Component Structure

```jsx
// src/components/MyComponent.jsx
import { useState } from 'react';

export default function MyComponent() {
  const [state, setState] = useState('');
  
  return (
    <div className="my-component">
      <h3>My Component</h3>
      <p>{state}</p>
    </div>
  );
}
```

### Using API Hooks

```jsx
import { useApi } from '../hooks/useApi';

export default function OrdersList() {
  const { data, loading, error } = useApi('/api/orders');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.orders?.map(order => (
        <div key={order.id}>{order.order_number}</div>
      ))}
    </div>
  );
}
```

### Authentication

```jsx
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Styling

```jsx
// Use inline styles or CSS classes
<div className="panel">
  <h3>Title</h3>
  <p>Content</p>
</div>

// Global styles in src/index.css
// Component-specific styles in <style> tags
```

---

## Backend Development

### Creating New API Endpoint

```javascript
// api/orders/update.js
import { getDb } from '../utils/db.js';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/middleware.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return errorResponse(res, 401, 'Missing authorization token');
    }

    const user = verifyToken(token);
    if (!user) {
      return errorResponse(res, 401, 'Invalid token');
    }

    // Get database
    const db = await getDb();
    if (!db) {
      return errorResponse(res, 500, 'Database connection failed');
    }

    // Handle request
    if (req.method === 'PATCH') {
      const { id, status } = req.body;
      
      // Update order
      await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        [status, id]
      );

      return res.status(200).json({ success: true });
    }

    return errorResponse(res, 405, 'Method not allowed');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, error.message);
  }
}
```

### Testing API Endpoint

```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yellowcity.local","password":"admin123"}' \
  | jq -r '.token')

# Use token
curl -X PATCH http://localhost:3000/api/orders/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"id":1,"status":"In Production"}'
```

---

## Debugging

### Frontend Debugging

```javascript
// Use browser DevTools
// F12 or Cmd+Option+I

// Console logging
console.log('Value:', value);
console.error('Error:', error);

// React DevTools browser extension
// Inspect component state and props
```

### Backend Debugging

```javascript
// Add console logs
console.log('Database query:', query);
console.error('Error:', error);

// Check Vercel logs
vercel logs

// Local testing
// Add breakpoints in VSCode
// Run with debugger
node --inspect api/auth/login.js
```

### Database Debugging

```bash
# Check query performance
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'New';

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Check slow queries
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

---

## Git Workflow

### Making Changes

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# Edit files...

# Commit changes
git add .
git commit -m "feat: add new feature

- Detailed description
- What changed
- Why it changed"

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# Request review
# Merge when approved
```

### Commit Message Format

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

### Merging to Main

```bash
# After PR is approved and merged
git checkout main
git pull origin main

# Delete feature branch
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

---

## Testing

### Manual Testing

```bash
# Test login flow
1. Visit http://localhost:5173
2. Enter admin@yellowcity.local / admin123
3. Verify dashboard loads
4. Check all menu items work
5. Verify data displays correctly

# Test API
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Automated Testing (Future)

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## Performance Tips

### Frontend

```javascript
// Use React.memo for expensive components
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);

// Use useMemo for expensive calculations
const result = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Backend

```javascript
// Use database indexes
CREATE INDEX idx_orders_status ON orders(status);

// Use connection pooling (already configured)

// Cache frequently accessed data
const cache = new Map();

// Limit query results
SELECT * FROM orders LIMIT 100;
```

---

## Troubleshooting

### "Cannot find module 'wouter'"

```bash
npm install wouter
```

### "Database connection failed"

```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Verify PostgreSQL is running
pg_isready
```

### "JWT token invalid"

```bash
# Check JWT_SECRET is set
echo $JWT_SECRET

# Regenerate if needed
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Port 5173 already in use"

```bash
# Kill process using port
lsof -i :5173
kill -9 <PID>

# Or use different port
npm run dev -- --port 5174
```

---

## Resources

- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Node.js Docs:** https://nodejs.org/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs
- **Express Docs:** https://expressjs.com
- **Vercel Docs:** https://vercel.com/docs

---

## Getting Help

1. Check existing GitHub issues
2. Search documentation
3. Ask in project discussions
4. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc)

---

## Code Style

```javascript
// Use consistent formatting
// ESLint rules are configured in package.json

// Run formatter
npm run format

// Check for issues
npm run lint
```

---

**Happy coding! 🚀**
