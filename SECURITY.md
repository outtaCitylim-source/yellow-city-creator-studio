# Security Guide — Yellow City Creator Studio

This guide covers security best practices, hardening, and compliance for production deployment.

---

## Pre-Deployment Security Checklist

### Authentication & Authorization

- [ ] JWT_SECRET is strong (32+ random characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] JWT tokens have expiration time (7 days recommended)
  ```javascript
  const expiresIn = '7d'; // Verify in api/utils/jwt.js
  ```

- [ ] Password hashing uses PBKDF2 with strong parameters
  ```javascript
  // Verify in api/utils/password.js
  // iterations: 100000, keylen: 64, digest: 'sha256'
  ```

- [ ] Admin user password is changed from default
  ```bash
  # Update ADMIN_PASSWORD in .env before deployment
  ```

- [ ] Role-based access control is enforced
  ```javascript
  // Verify in API endpoints: if (req.user.role !== 'admin') return 401
  ```

### Database Security

- [ ] DATABASE_URL uses SSL/TLS connection
  ```
  postgres://user:password@host:port/dbname?sslmode=require
  ```

- [ ] Database user has minimal required permissions
  ```sql
  -- Create restricted user (not superuser)
  CREATE ROLE app_user WITH LOGIN PASSWORD 'strong-password';
  GRANT CONNECT ON DATABASE yellow_city_studio TO app_user;
  GRANT USAGE ON SCHEMA public TO app_user;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
  ```

- [ ] Database backups are enabled and tested
  ```bash
  # Verify with provider (Vercel Postgres, Neon, Railway)
  # Test restore process monthly
  ```

- [ ] Database connection pooling is configured
  ```javascript
  // Verify in api/utils/db.js: max: 20 connections
  ```

- [ ] Sensitive data is not logged
  ```javascript
  // Never log passwords, tokens, or personal data
  console.log('User:', user.id); // OK
  console.log('Password:', password); // NEVER
  ```

### API Security

- [ ] All endpoints validate input (no SQL injection)
  ```javascript
  // Use parameterized queries: $1, $2, etc.
  // Never concatenate user input into SQL
  ```

- [ ] CORS is restricted to your domain
  ```javascript
  // In production: Access-Control-Allow-Origin: https://yourdomain.com
  // Not: * (wildcard)
  ```

- [ ] Rate limiting is enabled
  ```javascript
  // Verify in api/utils/middleware.js: checkRateLimit()
  // 100 requests per minute per IP
  ```

- [ ] Request size limits are enforced
  ```javascript
  // Verify in api/utils/middleware.js: 1MB payload limit
  ```

- [ ] Error messages don't leak sensitive information
  ```javascript
  // Production: "Invalid credentials"
  // Not: "User not found" or "Password incorrect"
  ```

- [ ] API endpoints require authentication
  ```javascript
  // Verify all endpoints check JWT token
  // Except: /api/auth/login (public)
  ```

### Frontend Security

- [ ] HTTPS is enforced (automatic with Vercel)
  ```
  https://your-domain.vercel.app
  ```

- [ ] Sensitive data is not stored in localStorage
  ```javascript
  // OK: JWT token (short-lived)
  // NOT: passwords, API keys, personal data
  ```

- [ ] Content Security Policy headers are set
  ```javascript
  // Vercel sets default CSP headers
  // Verify: Response headers in browser DevTools
  ```

- [ ] XSS protection is enabled
  ```javascript
  // Sanitize user input in api/utils/validation.js
  // Use DOMPurify if rendering HTML
  ```

- [ ] CSRF tokens are used for state-changing operations
  ```javascript
  // Verify in form submissions
  ```

### Secrets Management

- [ ] No secrets in `.env.example`
  ```bash
  # .env.example contains only placeholders
  # Actual values in .env.local (local) or Vercel dashboard (production)
  ```

- [ ] No secrets in code comments
  ```javascript
  // ❌ Bad: JWT_SECRET=abc123
  // ✅ Good: // Use strong random value
  ```

- [ ] No secrets in git history
  ```bash
  # Verify: git log --all --source --remotes -- .env
  # Should return nothing
  ```

- [ ] Secrets are rotated regularly
  ```bash
  # Every 90 days:
  # 1. Generate new JWT_SECRET
  # 2. Update in Vercel
  # 3. Redeploy
  # 4. Monitor for issues
  ```

- [ ] Access to secrets is restricted
  ```bash
  # Only project owner can view Vercel environment variables
  # Use GitHub branch protection for code changes
  ```

### Deployment Security

- [ ] HTTPS is enforced
  ```
  Vercel automatically provides SSL certificate
  ```

- [ ] Security headers are set
  ```
  Strict-Transport-Security: max-age=31536000
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  ```

- [ ] Vercel environment is production
  ```bash
  NODE_ENV=production
  ```

- [ ] Function timeouts are appropriate
  ```javascript
  // In vercel.json: "maxDuration": 30 (seconds)
  ```

- [ ] Logs don't contain sensitive data
  ```bash
  vercel logs
  # Should not show passwords, tokens, or personal data
  ```

### Monitoring & Incident Response

- [ ] Error monitoring is enabled
  ```bash
  # Consider: Sentry, LogRocket, or similar
  # Captures errors without sensitive data
  ```

- [ ] Performance monitoring is enabled
  ```bash
  # Vercel Analytics: https://vercel.com/docs/analytics
  # Monitor response times and error rates
  ```

- [ ] Uptime monitoring is enabled
  ```bash
  # Consider: Uptime Robot, StatusPage, or similar
  # Alerts on downtime
  ```

- [ ] Incident response plan is documented
  ```markdown
  # If security incident occurs:
  # 1. Disable affected accounts
  # 2. Rotate compromised secrets
  # 3. Review logs for unauthorized access
  # 4. Notify affected users
  # 5. Post-incident review
  ```

---

## Common Security Vulnerabilities

### SQL Injection

**Vulnerable:**
```javascript
// ❌ NEVER do this
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**Secure:**
```javascript
// ✅ Use parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

### Cross-Site Scripting (XSS)

**Vulnerable:**
```jsx
// ❌ NEVER do this
<div>{userInput}</div>
```

**Secure:**
```jsx
// ✅ React automatically escapes by default
<div>{userInput}</div>

// For HTML content, sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### Cross-Site Request Forgery (CSRF)

**Vulnerable:**
```javascript
// ❌ No protection
POST /api/orders/delete
```

**Secure:**
```javascript
// ✅ Verify origin and use SameSite cookies
// Vercel sets SameSite=Lax by default
```

### Broken Authentication

**Vulnerable:**
```javascript
// ❌ Weak password requirements
if (password.length < 4) return 'OK';
```

**Secure:**
```javascript
// ✅ Strong requirements
// 8+ chars, letters, numbers, special chars
if (password.length < 8 || !/[a-z]/.test(password)) return 'Invalid';
```

### Sensitive Data Exposure

**Vulnerable:**
```javascript
// ❌ Storing sensitive data in localStorage
localStorage.setItem('password', password);
```

**Secure:**
```javascript
// ✅ Store only short-lived tokens
localStorage.setItem('token', jwtToken); // expires in 7 days
```

### Broken Access Control

**Vulnerable:**
```javascript
// ❌ No role check
if (req.user) {
  // Allow any authenticated user
}
```

**Secure:**
```javascript
// ✅ Check specific role
if (req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Forbidden' });
}
```

---

## Security Testing

### Manual Testing

```bash
# 1. Test SQL injection
curl -X POST https://your-app.vercel.app/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"1 OR 1=1","order_number":"test"}'

# 2. Test XSS
curl -X POST https://your-app.vercel.app/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>"}'

# 3. Test authentication bypass
curl -X GET https://your-app.vercel.app/api/orders
# Should return 401 Unauthorized

# 4. Test authorization
curl -X GET https://your-app.vercel.app/api/admin/settings \
  -H "Authorization: Bearer $USER_TOKEN"
# Should return 403 Forbidden (if user is not admin)
```

### Automated Testing

```bash
# OWASP ZAP (free security scanner)
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://your-app.vercel.app

# npm audit (check dependencies)
npm audit
npm audit fix

# Snyk (vulnerability scanning)
npx snyk test
```

---

## Compliance & Standards

### OWASP Top 10

- [ ] A01:2021 – Broken Access Control
- [ ] A02:2021 – Cryptographic Failures
- [ ] A03:2021 – Injection
- [ ] A04:2021 – Insecure Design
- [ ] A05:2021 – Security Misconfiguration
- [ ] A06:2021 – Vulnerable and Outdated Components
- [ ] A07:2021 – Identification and Authentication Failures
- [ ] A08:2021 – Software and Data Integrity Failures
- [ ] A09:2021 – Logging and Monitoring Failures
- [ ] A10:2021 – Server-Side Request Forgery (SSRF)

### Data Protection

- [ ] GDPR compliance (if serving EU users)
  ```
  - Privacy policy
  - Data retention policy
  - User data export/deletion
  ```

- [ ] CCPA compliance (if serving California users)
  ```
  - Privacy policy
  - Data sale opt-out
  - User data access
  ```

---

## Incident Response

### If Compromised

1. **Immediate Actions**
   ```bash
   # Disable affected accounts
   UPDATE users SET is_active = false WHERE id = ?;
   
   # Rotate JWT_SECRET
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Update in Vercel and redeploy
   vercel env pull
   # Edit .env.local
   vercel env push
   vercel --prod
   ```

2. **Investigation**
   ```bash
   # Review logs
   vercel logs --follow
   
   # Check database for unauthorized changes
   SELECT * FROM users WHERE created_at > NOW() - INTERVAL '1 hour';
   SELECT * FROM orders WHERE updated_at > NOW() - INTERVAL '1 hour';
   ```

3. **Communication**
   - Notify affected users
   - Provide password reset link
   - Offer identity protection services
   - Post incident report

---

## Resources

- **OWASP:** https://owasp.org
- **NIST Cybersecurity Framework:** https://www.nist.gov/cyberframework
- **CWE Top 25:** https://cwe.mitre.org/top25
- **Vercel Security:** https://vercel.com/security
- **PostgreSQL Security:** https://www.postgresql.org/docs/current/sql-syntax.html

---

## Support

For security issues:
1. **Do NOT** create public GitHub issues
2. Email: security@yellowcity.local
3. Include: description, reproduction steps, impact

---

**Last Updated:** 2024
**Review Frequency:** Quarterly
