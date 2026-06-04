# Contributing to Yellow City Creator Studio

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** with clear, atomic commits
5. **Test thoroughly** before pushing
6. **Push to your fork** and create a pull request

## Development Workflow

### 1. Set Up Your Environment

```bash
git clone https://github.com/YOUR-USERNAME/yellow-city-creator-studio.git
cd yellow-city-creator-studio
npm install
cp .env.example .env.local
# Edit .env.local with your local database
npm run dev
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation updates
- `refactor/` — Code refactoring
- `perf/` — Performance improvements
- `test/` — Test additions/updates

### 3. Make Your Changes

- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

**Commit message format:**
```
type(scope): description

More detailed explanation if needed.

Fixes #123
```

Examples:
```
feat(orders): add order status filtering
fix(auth): correct JWT expiry calculation
docs(readme): update deployment instructions
refactor(api): simplify database queries
```

### 4. Format and Lint

Before committing, ensure your code meets the project standards:

```bash
# Format code with Prettier
npm run format

# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint -- --fix
```

### 5. Test Your Changes

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### 6. Build Locally

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Verify the build succeeds and the app works as expected.

### 7. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then on GitHub:
1. Create a pull request from your fork to the main repository
2. Fill out the PR template completely
3. Reference any related issues (e.g., "Fixes #123")
4. Wait for code review

## Pull Request Guidelines

### PR Title
- Use clear, descriptive titles
- Start with the type: `feat:`, `fix:`, `docs:`, etc.
- Example: `feat: add customer search functionality`

### PR Description
Include:
- **What:** What does this PR do?
- **Why:** Why is this change needed?
- **How:** How does it work?
- **Testing:** How was it tested?
- **Screenshots:** For UI changes, include before/after

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] All tests pass locally (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Changes are focused and atomic
- [ ] Commit messages are clear and descriptive

## Code Style

### JavaScript/React

- Use ES2022+ syntax
- Use functional components with hooks
- Use descriptive variable names
- Keep functions small and focused
- Add comments for complex logic

**Example:**
```javascript
// Good
const fetchOrders = async (customerId) => {
  try {
    const response = await fetch(`/api/orders?customer=${customerId}`);
    return response.json();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
};

// Avoid
const f = async (c) => {
  return fetch(`/api/orders?customer=${c}`).then(r => r.json());
};
```

### CSS

- Use CSS custom properties for colors and spacing
- Follow BEM naming convention for classes
- Keep specificity low
- Use flexbox/grid for layouts

**Example:**
```css
/* Good */
.order-card {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.order-card__title {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Avoid */
.OrderCard {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}

.OrderCard h2 {
  font-weight: 600;
  color: #000;
}
```

### SQL

- Use lowercase for keywords
- Use meaningful table/column names
- Add comments for complex queries
- Use parameterized queries to prevent SQL injection

**Example:**
```sql
-- Good
select id, name, email
from customers
where segment = $1 and created_at > $2
order by created_at desc;

-- Avoid
SELECT * FROM customers WHERE segment = 'Business';
```

## Testing

### Unit Tests

Test individual functions and components:

```javascript
import { calculateQuotePrice } from './quoteCalculator';

describe('calculateQuotePrice', () => {
  it('should calculate price for DTF with quantity discount', () => {
    const price = calculateQuotePrice({
      method: 'DTF',
      quantity: 72,
      rush: false
    });
    expect(price).toBe(1152); // 16 * 72 * 0.82
  });

  it('should add rush fee when applicable', () => {
    const price = calculateQuotePrice({
      method: 'DTF',
      quantity: 24,
      rush: true
    });
    expect(price).toBe(459); // (16 * 24) + 75
  });
});
```

### Integration Tests

Test API endpoints and database interactions:

```javascript
describe('POST /api/orders', () => {
  it('should create a new order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerId: 1,
        method: 'DTF',
        quantity: 24
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

## Documentation

### README Updates

Update `README.md` if you:
- Add new features
- Change deployment process
- Add new environment variables
- Change API endpoints

### Code Comments

Add comments for:
- Complex algorithms
- Non-obvious business logic
- Important decisions
- Workarounds or hacks

**Good comments:**
```javascript
// Calculate discount based on quantity tiers
// 72+ items: 18% off, 36-71: 10% off, <36: no discount
const discount = quantity >= 72 ? 0.82 : quantity >= 36 ? 0.9 : 1;
```

**Avoid:**
```javascript
// Loop through orders
for (let i = 0; i < orders.length; i++) {
  // ...
}
```

## Common Issues

### "npm install" fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Build fails locally but works on Vercel
```bash
# Try a clean build
npm run build -- --force

# Check for environment variables
echo $DATABASE_URL
```

### Tests fail
```bash
# Run tests with verbose output
npm run test -- --reporter=verbose

# Run a specific test file
npm run test -- __tests__/auth.test.js
```

## Getting Help

- **GitHub Issues:** Search for similar issues or create a new one
- **Discussions:** Use GitHub Discussions for questions
- **Email:** support@yellowcity.local
- **Code Review:** Ask for feedback in your PR

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Project changelog
- README (for significant contributions)

Thank you for contributing to Yellow City Creator Studio! 🎉
