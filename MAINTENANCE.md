# Maintenance & Operations Guide — Yellow City Creator Studio

Ongoing maintenance procedures, monitoring, and troubleshooting.

---

## Daily Operations

### Morning Checklist

```bash
# 1. Check system status
vercel logs --follow

# 2. Monitor error rate
# Check Vercel dashboard → Analytics

# 3. Verify database connectivity
psql $DATABASE_URL -c "SELECT 1"

# 4. Check recent deployments
vercel ls
```

### End of Day

```bash
# 1. Review error logs
vercel logs --follow | grep -i error

# 2. Check for failed deployments
vercel ls --failed

# 3. Verify backups completed
# Check with database provider
```

---

## Weekly Maintenance

### Monday

```bash
# 1. Review performance metrics
# Vercel Dashboard → Analytics
# - Response times
# - Error rates
# - Request volume

# 2. Check database performance
psql $DATABASE_URL << EOF
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
EOF

# 3. Review security logs
# Check for suspicious activity
# Unusual login attempts
# Rate limit violations
```

### Wednesday

```bash
# 1. Test database backup/restore
# Contact database provider
# Verify backups are working

# 2. Update dependencies
npm outdated
npm update

# 3. Run security audit
npm audit
npx snyk test
```

### Friday

```bash
# 1. Review user feedback
# GitHub issues
# Support emails
# Feature requests

# 2. Plan next week's tasks
# Prioritize issues
# Schedule maintenance windows

# 3. Generate weekly report
# Performance summary
# Incidents
# Changes made
```

---

## Monthly Maintenance

### First Week

```bash
# 1. Security review
# Review SECURITY.md checklist
# Verify all items completed

# 2. Dependency updates
npm update
npm audit fix

# 3. Code review
# Review recent commits
# Check for security issues

# 4. Performance optimization
# Identify slow queries
# Add database indexes if needed
```

### Second Week

```bash
# 1. Database maintenance
# Vacuum and analyze
psql $DATABASE_URL << EOF
VACUUM ANALYZE;
EOF

# 2. Backup verification
# Test restore procedure
# Verify backup integrity

# 3. Disaster recovery drill
# Test failover procedures
# Document recovery time
```

### Third Week

```bash
# 1. Capacity planning
# Review growth metrics
# Plan for scaling

# 2. Cost analysis
# Review Vercel bill
# Review database costs
# Optimize if needed

# 3. Documentation update
# Update README
# Update API docs
# Update deployment guide
```

### Fourth Week

```bash
# 1. User feedback review
# Analyze support tickets
# Identify common issues

# 2. Feature prioritization
# Review feature requests
# Plan next quarter

# 3. Team training
# Update team on changes
# Share lessons learned
```

---

## Quarterly Maintenance

### Q1 Review

```bash
# 1. Security audit
# Full security review
# Penetration testing
# Vulnerability assessment

# 2. Architecture review
# Assess current design
# Identify bottlenecks
# Plan improvements

# 3. Performance review
# Analyze metrics
# Identify optimization opportunities
# Plan upgrades if needed

# 4. Compliance review
# GDPR compliance
# Data protection
# Privacy policy
```

### Q2 Review

```bash
# 1. Dependency audit
# Review all dependencies
# Check for security issues
# Plan major upgrades

# 2. Database review
# Analyze query performance
# Review indexes
# Plan optimization

# 3. Cost optimization
# Review all services
# Identify cost savings
# Plan migrations if needed
```

### Q3 Review

```bash
# 1. Disaster recovery
# Full DR test
# Verify recovery procedures
# Document lessons learned

# 2. Capacity planning
# Review growth
# Plan for scaling
# Estimate costs

# 3. Technology review
# Evaluate new technologies
# Plan upgrades
# Assess risks
```

### Q4 Review

```bash
# 1. Annual security review
# Full security audit
# Penetration testing
# Compliance verification

# 2. Performance review
# Annual metrics analysis
# Identify improvements
# Plan next year

# 3. Budget planning
# Review annual costs
# Plan next year budget
# Identify savings
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

```
Application
├── Response Time (target: <500ms)
├── Error Rate (target: <0.1%)
├── Request Volume
└── Active Users

Database
├── Query Performance (target: <100ms)
├── Connection Pool Usage (target: <80%)
├── Storage Usage (target: <80%)
└── Backup Status

Infrastructure
├── CPU Usage (target: <70%)
├── Memory Usage (target: <70%)
├── Disk Usage (target: <80%)
└── Uptime (target: 99.9%)
```

### Alert Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Response Time | >1000ms | Investigate performance |
| Error Rate | >1% | Check logs, investigate |
| Database CPU | >90% | Upgrade or optimize |
| Storage | >90% | Archive old data |
| Uptime | <99% | Investigate downtime |

### Setting Up Alerts

```bash
# Vercel Alerts
# Dashboard → Settings → Alerts

# Email notifications for:
# - Deployment failures
# - High error rates
# - Performance issues

# Slack integration (optional)
# Connect Vercel to Slack
# Get real-time notifications
```

---

## Troubleshooting

### Application Won't Start

```bash
# 1. Check logs
vercel logs --follow

# 2. Verify environment variables
vercel env list

# 3. Check dependencies
npm install

# 4. Test build locally
npm run build

# 5. Redeploy
vercel --prod
```

### Database Connection Failed

```bash
# 1. Verify DATABASE_URL
echo $DATABASE_URL

# 2. Test connection
psql $DATABASE_URL -c "SELECT 1"

# 3. Check network connectivity
ping $(echo $DATABASE_URL | cut -d'@' -f2 | cut -d':' -f1)

# 4. Verify credentials
# Check username and password

# 5. Check firewall rules
# Verify IP whitelist
```

### High Response Times

```bash
# 1. Check database performance
psql $DATABASE_URL << EOF
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'New';
EOF

# 2. Add indexes if needed
psql $DATABASE_URL << EOF
CREATE INDEX idx_orders_status ON orders(status);
EOF

# 3. Check for slow queries
psql $DATABASE_URL << EOF
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
EOF

# 4. Review API logs
vercel logs --follow | grep -i slow
```

### High Error Rate

```bash
# 1. Check recent deployments
vercel ls

# 2. Review error logs
vercel logs --follow | grep -i error

# 3. Check for database issues
psql $DATABASE_URL -c "SELECT 1"

# 4. Rollback if needed
vercel rollback
```

### Out of Memory

```bash
# 1. Check memory usage
# Vercel dashboard → Analytics

# 2. Identify memory leaks
# Review recent code changes

# 3. Optimize code
# Remove unnecessary data structures
# Implement pagination

# 4. Increase memory (if available)
# Upgrade Vercel plan
```

### Database Storage Full

```bash
# 1. Check storage usage
psql $DATABASE_URL << EOF
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables 
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
EOF

# 2. Archive old data
psql $DATABASE_URL << EOF
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '2 years';
VACUUM ANALYZE;
EOF

# 3. Increase storage quota
# Contact database provider
```

---

## Backup & Recovery

### Automated Backups

```
Vercel Postgres:
├── Daily backups (7-day retention)
├── Automatic retention
└── Manual backup option

Neon:
├── Hourly backups
├── 7-day retention
└── Manual backup option

Railway:
├── Daily backups
├── 7-day retention
└── Manual backup option
```

### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Compress
gzip backup-*.sql

# Upload to S3 or cloud storage
aws s3 cp backup-*.sql.gz s3://your-bucket/backups/
```

### Recovery Procedure

```bash
# 1. Get backup file
aws s3 cp s3://your-bucket/backups/backup-20240601.sql.gz .

# 2. Decompress
gunzip backup-20240601.sql.gz

# 3. Restore database
psql $DATABASE_URL < backup-20240601.sql

# 4. Verify data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM orders"

# 5. Notify team
# Update status page
# Send notification
```

---

## Performance Optimization

### Database Optimization

```bash
# 1. Analyze query performance
psql $DATABASE_URL << EOF
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'New';
EOF

# 2. Add indexes
psql $DATABASE_URL << EOF
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_customers_segment ON customers(segment);
EOF

# 3. Vacuum and analyze
psql $DATABASE_URL << EOF
VACUUM ANALYZE;
EOF

# 4. Monitor query performance
psql $DATABASE_URL << EOF
SELECT query, calls, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 20;
EOF
```

### API Optimization

```javascript
// 1. Add caching headers
res.setHeader('Cache-Control', 'public, max-age=300');

// 2. Implement pagination (already done)
// Limit results to 50 per page

// 3. Use database indexes
// Already configured

// 4. Compress responses
// Vercel handles gzip automatically
```

### Frontend Optimization

```javascript
// 1. Code splitting
// Already implemented with Vite

// 2. Lazy loading
// Load components on demand

// 3. Image optimization
// Use optimized formats

// 4. Caching
// Service workers for offline support
```

---

## Security Maintenance

### Regular Security Tasks

```bash
# Weekly
npm audit
npx snyk test

# Monthly
# Full security review
# Check for vulnerabilities
# Review access logs

# Quarterly
# Penetration testing
# Security audit
# Compliance review

# Annually
# Full security assessment
# Update security policies
# Team training
```

### Secrets Rotation

```bash
# Every 90 days
# 1. Generate new JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Update in Vercel
vercel env pull
# Edit .env.local
vercel env push

# 3. Redeploy
vercel --prod

# 4. Monitor for issues
vercel logs --follow
```

---

## Documentation Updates

### When to Update

- [ ] After major changes
- [ ] After deployments
- [ ] After incidents
- [ ] Quarterly review
- [ ] When adding features
- [ ] When fixing bugs

### What to Update

- [ ] README.md
- [ ] API_REFERENCE.md
- [ ] ARCHITECTURE.md
- [ ] DEPLOYMENT.md
- [ ] SECURITY.md
- [ ] Changelog

---

## Incident Response

### During Incident

```bash
# 1. Assess severity
# - Is it affecting users?
# - How many users?
# - What's the impact?

# 2. Notify team
# - Slack notification
# - Email alert
# - Page on-call engineer

# 3. Investigate
vercel logs --follow
# Check database
# Check API responses

# 4. Implement fix
# - Deploy hotfix
# - Or rollback

# 5. Monitor
# - Watch error rates
# - Monitor performance
# - Verify fix works
```

### After Incident

```bash
# 1. Post-mortem
# - What happened?
# - Why did it happen?
# - How do we prevent it?

# 2. Document
# - Add to incident log
# - Update runbooks
# - Update documentation

# 3. Implement improvements
# - Add monitoring
# - Add tests
# - Add safeguards

# 4. Share learnings
# - Team meeting
# - Documentation
# - Training
```

---

## Runbooks

### Deployment Runbook

```bash
# 1. Prepare changes
git checkout -b feature/my-feature
# Make changes
npm run build
npm run test

# 2. Create PR
git push origin feature/my-feature
# Create pull request on GitHub
# Request review

# 3. Deploy
# After PR approved and merged
# Vercel automatically deploys

# 4. Verify
vercel logs --follow
# Check for errors
# Monitor metrics

# 5. Rollback if needed
vercel rollback
```

### Rollback Runbook

```bash
# 1. Identify issue
vercel ls
# Find previous deployment

# 2. Rollback
vercel rollback <deployment-id>

# 3. Verify
vercel logs --follow
# Check for errors

# 4. Investigate
# Why did the deployment fail?
# Fix the issue

# 5. Redeploy
# After fix is ready
vercel --prod
```

---

## Resources

- **Vercel Docs:** https://vercel.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs
- **Node.js Docs:** https://nodejs.org/docs
- **Incident Response:** https://www.incident.io

---

**Last Updated:** 2024
**Review Frequency:** Quarterly
