# Security Configuration and Best Practices

## Quick Start
1. Copy `.env.example` to `.env` and fill in the values
2. Install dependencies: `npm install`
3. Run security audit: `npm run audit:ci`
4. Start development server: `npm run dev`

## Security Features
- CSP headers configured
- Rate limiting enabled
- Input sanitization
- Secure storage practices
- DDoS protection
- XSS prevention

## Production Deployment Stack
- Frontend: Vercel/Netlify
- CDN: Cloudflare
- Database: AWS RDS (if needed)

### Cloudflare Settings
1. Enable WAF
2. Set Rate Limiting Rules:
   - 100 req/min per IP
   - Browser Integrity Check: ON
   - Bot Fight Mode: ON
3. Enable Brotli Compression
4. Cache Configuration:
   - Cache static assets
   - Bypass cache for API routes

### Security Headers
All required security headers are configured in the middleware:
- HSTS
- CSP
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Rate Limiting
Default configuration:
- Window: 60 seconds
- Max Requests: 100 per window
- Burst: 50 requests

## Secrets Management
1. Never commit `.env` files
2. Rotate secrets every 90 days
3. Use environment-specific secrets
4. Monitor secret usage with audit logs

## Security Checks
Run these commands regularly:
```bash
# Dependency audit
npm run audit:ci

# Run tests
npm test

# Lint check
npm run lint

# Build check
npm run build
```

## Emergency Response
1. Revoke compromised secrets
2. Deploy from last known good state
3. Review audit logs
4. Update security patches
5. Document incident

## Monitoring
- Health check endpoint: `/healthz`
- Error tracking: Sentry integration
- Performance monitoring: Lighthouse reports
- Security alerts: Cloudflare notifications