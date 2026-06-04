# Yellow City Creator Studio

A production-ready custom apparel shop management system for Yellow City Custom Tees in Amarillo, Texas.

**Status:** Migrating from Replit to GitHub + Vercel + PostgreSQL  
**Current Version:** 2.0.0 (Production Migration)

---

## Business Details

- **Business:** Yellow City Custom Tees
- **Owner:** Ashton Hammer
- **Creator & Head Designer:** Dillon Richards
- **Address:** 3708 Olsen Blvd, Amarillo, TX 79109
- **Phone:** (806) 803-7255
- **Website:** amarillothreads.com

---

## Features

### Public-Facing
- Creator Bar landing page
- Service showcase (DTF, DTG, Embroidery, Garment Wash)
- 4-step workflow visualization
- Product catalog
- Contact & CTA sections

### Shop Operations Dashboard
- Dashboard with real-time stats
- Order management board (status tracking: New → Picked Up)
- POS quick-sale screen
- Custom quote builder with live price estimates
- Inventory tracker (SKU, stock levels, reorder thresholds)
- Customer CRM with segmentation (Walk-in, Team, Business, Graduation, Event)
- Loyalty program framework
- Walk-in kiosk mode
- Admin settings

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + Vite |
| **Backend** | Vercel Functions (Node.js) |
| **Database** | PostgreSQL |
| **Authentication** | JWT |
| **Deployment** | Vercel |
| **Version Control** | GitHub |
| **Package Manager** | npm |

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+ (local or remote)

### Local Development

```bash
# Clone repository
git clone https://github.com/outtaCitylim-source/yellow-city-creator-studio.git
cd yellow-city-creator-studio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (automatic on push to main)
git push origin main
```

---

## Project Structure

```
yellow-city-creator-studio/
├── src/                     # Frontend (React/Vite)
│   ├── App.jsx
│   ├── CreatorBar.jsx
│   ├── StudioShell.jsx
│   ├── data.js
│   ├── main.jsx
│   ├── styles.css
│   └── creator.css
├── api/                     # Backend (Vercel Functions)
│   ├── auth/
│   ├── orders/
│   ├── customers/
│   ├── inventory/
│   └── quotes/
├── public/                  # Static assets
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Environment Variables

See `.env.example` for complete list. Key variables:

```bash
DATABASE_URL=postgresql://user:password@host:5432/yellow_city
JWT_SECRET=your-secret-key-here
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

**⚠️ Never commit `.env.local` to GitHub**

---

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Vite settings

3. **Add Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add all variables from `.env.example`
   - For DATABASE_URL: Use Vercel Postgres or external PostgreSQL

4. **Deploy**
   - Vercel automatically deploys on push to `main`
   - Preview deployments for pull requests

---

## Database

### Setup PostgreSQL

**Option 1: Vercel Postgres (Recommended)**
- In Vercel dashboard: Storage → Create Database → Postgres
- Copy `DATABASE_URL` and add to environment variables

**Option 2: External PostgreSQL**
- Use Supabase, AWS RDS, or local PostgreSQL
- Set `DATABASE_URL` connection string

### Run Migrations

```bash
npm run migrate:dev    # Local development
npm run migrate:prod   # Production
```

### Seed Sample Data

```bash
npm run seed
```

---

## API Documentation

### Authentication

All endpoints (except login) require JWT token:

```bash
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/orders` | List all orders |
| POST | `/api/orders` | Create new order |
| GET | `/api/customers` | List all customers |
| GET | `/api/inventory` | List inventory |
| POST | `/api/quotes` | Create quote |

---

## Development

### Available Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
npm run lint             # Lint code
npm run format           # Format code
npm run migrate:dev      # Run database migrations
npm run seed             # Seed database
```

### Code Style

- **Formatter:** Prettier
- **Linter:** ESLint
- **Language:** JavaScript ES2022+

Format before committing:
```bash
npm run format
```

---

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Database Connection Error
```bash
# Verify DATABASE_URL in .env.local
psql $DATABASE_URL
```

### Vercel Deployment Fails
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test locally: `npm run build`

---

## Security

- Never commit secrets to GitHub
- Use `.env.local` for local development
- JWT tokens expire after 7 days
- All API endpoints validate input
- HTTPS enforced in production
- CORS configured for trusted origins

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test: `npm run test && npm run build`
3. Format code: `npm run format`
4. Push and create a pull request
5. Wait for approval and merge

---

## Support

- **Issues:** [GitHub Issues](https://github.com/outtaCitylim-source/yellow-city-creator-studio/issues)
- **Email:** support@yellowcity.local
- **Phone:** (806) 803-7255

---

## License

MIT License - See LICENSE file

---

## Changelog

### Version 2.0.0 (Current)
- Migrated from Replit to GitHub + Vercel
- Added PostgreSQL database
- Implemented JWT authentication
- Created Vercel Functions backend
- Comprehensive documentation

### Version 1.0.0
- Initial Replit prototype
- Frontend-only with static data
- Complete dashboard UI

---

**Last Updated:** June 2, 2026  
**Maintained By:** Dillon Richards, Ashton Hammer
