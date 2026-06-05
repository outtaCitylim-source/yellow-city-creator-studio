# Deployment Guide — Yellow City Creator Studio

This guide covers deploying the Yellow City Creator Studio to Vercel with PostgreSQL database.

## Prerequisites

- GitHub account (repository already set up)
- Vercel account (free tier works)
- PostgreSQL database (local or cloud-hosted)
- Node.js 18+ locally for testing

---

## Step 1: Set Up PostgreSQL Database

### Option A: Cloud Database (Recommended)

**Using Vercel Postgres (Easiest):**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** → **Create Database** → **Postgres**
3. Select region closest to your users
4. Copy the connection string (looks like: `postgres://user:password@host:port/dbname`)

**Using Neon (Free tier, good alternative):**
1. Go to [Neon Console](https://console.neon.tech)
2. Create new project
3. Copy connection string

**Using Railway (Simple setup):**
1. Go to [Railway](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string from environment variables

### Option B: Local Database (Development Only)

```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Ubuntu

# Start PostgreSQL
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Ubuntu

# Create database
createdb yellow_city_studio

# Connection string
postgres://localhost:5432/yellow_city_studio
```

---

## Step 2: Initialize Database Schema

### Run Migrations

```bash
# Set DATABASE_URL locally
export DATABASE_URL="postgres://user:password@host:port/dbname"

# Run migration script
node api/migrations/run.js

# Or manually run SQL
psql $DATABASE_URL < api/migrations/init.sql
```

### Seed Sample Data (Optional)

```bash
# Populate with demo data
node api/seed.js
```

---

## Step 3: Configure Environment Variables

### Create `.env.local` for Local Development

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit with your values
nano .env.local
```

### Set Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable from `.env.example`:

```
DATABASE_URL = postgres://...
JWT_SECRET = your-random-secret-key-here
NODE_ENV = production
VITE_API_URL = https://your-domain.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Vercel will:
# 1. Build the project
# 2. Deploy frontend to CDN
# 3. Deploy API functions
# 4. Set environment variables
```

### Option B: GitHub Integration (Automatic)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select GitHub repository: `yellow-city-creator-studio`
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables (same as Step 3)
6. Click **Deploy**

Vercel will now automatically deploy on every push to `main` branch.

---

## Step 5: Test Deployment

### Verify Frontend
```bash
# Visit your Vercel URL
https://your-project.vercel.app

# Should show login page
# Login with: admin@yellowcity.local / admin123
```

### Test API Endpoints

```bash
# Get auth token
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yellowcity.local","password":"admin123"}'

# Response should include JWT token
# Use token for subsequent requests:

curl https://your-project.vercel.app/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Database Connection

```bash
# Vercel Functions logs
vercel logs

# Look for "Database connected" message
# Or check for connection errors
```

---

## Step 6: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Click **Add** → **Add Domain**
3. Enter your domain (e.g., `studio.yellowcity.com`)
4. Follow DNS setup instructions
5. Vercel provides free SSL certificate

---

## Step 7: Monitoring & Maintenance

### View Logs

```bash
# Real-time logs
vercel logs --follow

# Filter by function
vercel logs api/orders/list.js
```

### Database Backups

**Vercel Postgres:**
- Automatic daily backups
- 7-day retention
- Manual backups available

**Neon:**
- Automatic hourly backups
- 7-day retention

**Railway:**
- Automatic daily backups
- Manual backup option

### Performance Monitoring

```bash
# Check Vercel Analytics
# Dashboard → Analytics

# Monitor:
# - Response times
# - Error rates
# - Database queries
# - API usage
```

---

## Troubleshooting

### "Database connection failed"

```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Should be: postgres://user:password@host:port/dbname

# Test connection locally
psql $DATABASE_URL -c "SELECT 1"
```

### "JWT token invalid"

```bash
# Regenerate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in Vercel environment variables
# Redeploy
vercel --prod
```

### "API returns 500 error"

```bash
# Check logs for error details
vercel logs

# Common issues:
# 1. Missing environment variables
# 2. Database not initialized
# 3. Incorrect connection string
# 4. Function timeout (increase in vercel.json)
```

### "Slow API responses"

```bash
# Check database query performance
# Add indexes to frequently queried columns

# In PostgreSQL:
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_customers_segment ON customers(segment);

# Verify with EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'New';
```

---

## Local Development

### Start Dev Server

```bash
# Install dependencies
npm install

# Set environment variables
export DATABASE_URL="postgres://localhost:5432/yellow_city_studio"
export JWT_SECRET="dev-secret-key"

# Start Vite dev server
npm run dev

# Visit http://localhost:5173
```

### API Development

```bash
# Test API endpoints locally
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yellowcity.local","password":"admin123"}'
```

### Database Development

```bash
# Connect to local database
psql yellow_city_studio

# Useful commands:
# \dt                    - List tables
# \d orders              - Describe table
# SELECT * FROM orders;  - Query data
# \q                     - Quit
```

---

## Scaling Considerations

### When to Upgrade

- **Database:** If queries slow down, upgrade PostgreSQL tier
- **Vercel:** Automatic scaling, no action needed
- **API Rate Limiting:** Add rate limiter if needed

### Performance Optimization

```javascript
// Add caching headers
res.setHeader('Cache-Control', 'public, max-age=60');

// Use database connection pooling (already configured)

// Compress responses
app.use(compression());

// Add indexes for common queries
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

## Security Checklist

- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] DATABASE_URL uses SSL connection
- [ ] CORS is restricted to your domain
- [ ] API validates all inputs
- [ ] Passwords are hashed (PBKDF2)
- [ ] No secrets in `.env.example`
- [ ] GitHub repository is private
- [ ] Vercel environment variables are hidden
- [ ] Database backups are enabled
- [ ] HTTPS is enforced

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs
- **Node.js Docs:** https://nodejs.org/docs
- **GitHub Issues:** https://github.com/outtaCitylim-source/yellow-city-creator-studio/issues

---

## Next Steps

1. ✅ Set up PostgreSQL database
2. ✅ Configure environment variables
3. ✅ Deploy to Vercel
4. ✅ Test all features
5. ✅ Set up custom domain
6. ✅ Enable monitoring
7. ✅ Create backup schedule
8. ✅ Document any custom changes

**Questions?** Check the main README.md or create a GitHub issue.
