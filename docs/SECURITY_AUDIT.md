# Security Audit Notes - Yellow City Creator Studio

## Current security posture
The production upgrade branch now pins the Node runtime to Node 20 and adds a critical vulnerability audit script.

## Runtime pinning
The project previously allowed any Node version greater than or equal to 18. That can create future deployment risk when a new major Node version is released.

The upgrade branch now pins:

```json
"engines": {
  "node": "20.x",
  "npm": ">=9.0.0"
}
```

## CI audit gate
The CI workflow now runs:

```bash
npm run audit:critical
```

This blocks the branch if npm reports critical vulnerabilities.

## Why not use npm audit fix --force blindly
`npm audit fix --force` can introduce breaking dependency updates. For this app, forced dependency upgrades should only be used after verifying the Vite build, API functions, authentication flow, Stripe flow, and quote-intake UI.

## Recommended security follow-up
1. Review npm audit output after the new CI run completes.
2. Patch direct dependencies first.
3. Avoid breaking major upgrades unless needed.
4. Keep Stripe and Resend secrets only in Vercel environment variables.
5. Never commit `.env.local` or production secrets.
6. Add role-based access control before exposing staff operations publicly.
7. Add server-side validation to quote/order/customer endpoints before production use.
8. Add rate limiting or abuse protection to public quote intake before launch.

## Production launch rule
Do not merge the upgrade branch into main until:

- GitHub Actions passes.
- Vercel preview passes.
- Critical audit gate passes or has a documented exception.
- Manual QA checklist is complete.
