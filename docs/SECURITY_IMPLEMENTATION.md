# Security Hardening Implementation Plan

**Based on:** Security Audit Report (December 1, 2025)  
**Priority:** Critical security vulnerabilities  
**Timeline:** 3 weeks  

## Overview

This plan addresses critical security gaps identified in the security audit, focusing on:
1. Rate limiting (P0 - Critical)
2. Brute force protection (P0 - Critical)
3. Security headers (P1 - High)
4. CSRF protection (P2 - Medium)
5. DDOS mitigation (P1 - High)

---

## Phase 1: Critical Security Fixes (Week 1)

### 1. Rate Limiting Implementation

**Priority:** 🔴 P0 - CRITICAL  
**Effort:** Medium  
**Impact:** Prevents brute force and API abuse  

#### Install Dependencies

```bash
npm install @upstash/ratelimit @upstash/redis
npm install --save-dev @types/node
```

#### Create Rate Limiting Utility

**File:** `src/lib/security/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = Redis.fromEnv();

// Different rate limits for different use cases
export const rateLimits = {
  // Strict: Auth endpoints (5 requests per minute)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit:auth',
  }),

  // Medium: API endpoints (20 requests per minute)
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit:api',
  }),

  // Lenient: Public endpoints (60 requests per minute)
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit:public',
  }),
};

// Helper to get client identifier
export function getClientId(req: Request): string {
  // Try to get IP from headers (behind proxy)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  
  // For authenticated users, use user ID
  // This would be set after authentication
  const userId = (req as any).userId;
  
  return userId || ip;
}

// Middleware to check rate limit
export async function checkRateLimit(
  req: Request,
  limiter: Ratelimit
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const identifier = getClientId(req);
  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  
  return { success, limit, remaining, reset };
}
```

#### Apply Rate Limiting to Auth Routes

**File:** `src/app/api/auth/request-reset/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { rateLimits, checkRateLimit } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  // Check rate limit FIRST
  const rateLimit = await checkRateLimit(request, rateLimits.auth);
  
  if (!rateLimit.success) {
    logger.warn(
      { 
        ip: request.headers.get('x-forwarded-for'),
        endpoint: '/api/auth/request-reset',
        remaining: rateLimit.remaining,
      },
      'Rate limit exceeded'
    );
    
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimit.reset,
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
          'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Continue with normal logic...
}
```

#### Environment Variables

Add to `.env.local` and Vercel:

```bash
# Upstash Redis (Free tier: https://upstash.com/)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

---

### 2. Security Headers Configuration

**Priority:** 🟡 P1 - HIGH  
**Effort:** Low  
**Impact:** Prevents XSS, clickjacking, MITM  

#### Update Next.js Config

**File:** `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable browser XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          // HSTS - Force HTTPS (only in production)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### 3. Brute Force Protection

**Priority:** 🔴 P0 - CRITICAL  
**Effort:** Medium  
**Impact:** Prevents account takeover  

#### Account Lockout Implementation

**File:** `src/lib/security/brute-force.ts`

```typescript
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const LOCKOUT_THRESHOLD = 5; // Failed attempts before lockout
const LOCKOUT_DURATION = 15 * 60; // 15 minutes in seconds
const ATTEMPT_WINDOW = 15 * 60; // Track attempts in 15 min window

export interface LoginAttempt {
  count: number;
  lockedUntil?: number;
}

/**
 * Record a failed login attempt
 */
export async function recordFailedLogin(
  identifier: string // email or IP
): Promise<{ locked: boolean; attemptsRemaining: number; lockedUntil?: Date }> {
  const key = `failed_login:${identifier}`;
  
  // Get current attempts
  const data = await redis.get<LoginAttempt>(key);
  const attempts = data || { count: 0 };
  
  // Increment attempts
  attempts.count += 1;
  
  // Check if should be locked
  if (attempts.count >= LOCKOUT_THRESHOLD) {
    const lockedUntil = Date.now() + LOCKOUT_DURATION * 1000;
    attempts.lockedUntil = lockedUntil;
    
    // Store with lockout
    await redis.set(key, attempts, { ex: LOCKOUT_DURATION });
    
    return {
      locked: true,
      attemptsRemaining: 0,
      lockedUntil: new Date(lockedUntil),
    };
  }
  
  // Store attempts
  await redis.set(key, attempts, { ex: ATTEMPT_WINDOW });
  
  return {
    locked: false,
    attemptsRemaining: LOCKOUT_THRESHOLD - attempts.count,
  };
}

/**
 * Check if an identifier is locked out
 */
export async function isLockedOut(identifier: string): Promise<{
  locked: boolean;
  lockedUntil?: Date;
}> {
  const key = `failed_login:${identifier}`;
  const data = await redis.get<LoginAttempt>(key);
  
  if (!data || !data.lockedUntil) {
    return { locked: false };
  }
  
  // Check if still locked
  if (Date.now() < data.lockedUntil) {
    return {
      locked: true,
      lockedUntil: new Date(data.lockedUntil),
    };
  }
  
  // Lockout expired, clear it
  await redis.del(key);
  return { locked: false };
}

/**
 * Clear failed attempts after successful login
 */
export async function clearFailedLogins(identifier: string): Promise<void> {
  const key = `failed_login:${identifier}`;
  await redis.del(key);
}
```

#### Apply to Login Route

**File:** `src/app/api/auth/[...nextauth]/route.ts` (or credentials provider)

```typescript
import { isLockedOut, recordFailedLogin, clearFailedLogins } from '@/lib/security/brute-force';

// In your credentials provider authorize function:
async authorize(credentials) {
  const { email, password } = credentials;
  
  // Check if account is locked
  const lockStatus = await isLockedOut(email);
  if (lockStatus.locked) {
    const minutesRemaining = Math.ceil(
      (lockStatus.lockedUntil!.getTime() - Date.now()) / 60000
    );
    throw new Error(
      `Account temporarily locked. Try again in ${minutesRemaining} minutes.`
    );
  }
  
  // Verify credentials
  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.password))) {
    // Record failed attempt
    const result = await recordFailedLogin(email);
    
    if (result.locked) {
      throw new Error(
        `Too many failed attempts. Account locked for 15 minutes.`
      );
    }
    
    throw new Error(
      `Invalid credentials. ${result.attemptsRemaining} attempts remaining.`
    );
  }
  
  // Clear failed attempts on successful login
  await clearFailedLogins(email);
  
  return user;
}
```

---

## Phase 2: Enhanced Security (Week 2)

### 4. CSRF Protection for Custom Routes

**Priority:** 🟡 P2 - MEDIUM  
**Effort:** Low  
**Impact:** Prevents state-changing attacks  

NextAuth already handles CSRF for auth routes. For custom API routes handling sensitive mutations:

**File:** `src/lib/security/csrf.ts`

```typescript
import { NextRequest } from 'next/server';
import crypto from 'crypto';

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token from request
 */
export function verifyCSRFToken(
  req: NextRequest,
  expectedToken: string
): boolean {
  const token = req.headers.get('x-csrf-token') || req.cookies.get('csrf-token')?.value;
  
  if (!token || token !== expectedToken) {
    return false;
  }
  
  return true;
}
```

For critical operations (delete, update), check CSRF token.

---

### 5. Request Body Size Limits

**Priority:** 🟡 P1 - HIGH  
**Effort:** Low  
**Impact:** Prevents payload attacks  

**File:** `src/lib/security/validate-request.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const MAX_BODY_SIZE = 1024 * 1024; // 1MB

export async function validateRequestSize(
  req: NextRequest
): Promise<NextResponse | null> {
  const contentLength = req.headers.get('content-length');
  
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return NextResponse.json(
      { error: 'Request body too large' },
      { status: 413 }
    );
  }
  
  return null;
}
```

---

### 6. Dependency Scanning Setup

**Priority:** 🟡 P2 - MEDIUM  
**Effort:** Low  
**Impact:** Identifies vulnerable dependencies  

#### Add GitHub Dependabot

**File:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 10
    reviewers:
      - 'your-team'
    labels:
      - 'dependencies'
      - 'security'
```

#### Add npm audit to CI

```bash
# Run in CI/CD
npm audit --production
npm audit fix
```

---

## Environment Variables Summary

Add these to `.env.local` and Vercel:

```bash
# Upstash Redis (for rate limiting & brute force protection)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Existing variables (already have these)
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Testing Plan

### 1. Rate Limiting Tests

```bash
# Test auth rate limit (should fail after 5 requests)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/request-reset \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  echo "Request $i"
  sleep 1
done
```

Expected: First 5 succeed, rest return 429.

### 2. Brute Force Protection Test

```bash
# Test account lockout (should lock after 5 failed attempts)
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo "Attempt $i"
done
```

Expected: Account locked after 5 attempts.

### 3. Security Headers Test

```bash
# Check security headers
curl -I https://your-domain.vercel.app

# Should see:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: ...
# Content-Security-Policy: ...
```

---

##Verification Checklist

- [ ] Rate limiting configured on Upstash
- [ ] All auth routes have rate limiting
- [ ] Brute force protection on login
- [ ] Security headers in `next.config.ts`
- [ ] Headers visible in production
- [ ] Account lockout tested
- [ ] Rate limits tested
- [ ] Dependabot enabled
- [ ] `npm audit` passes
- [ ] Documentation updated

---

## Rollout Plan

### Week 1 (Critical)
- Day 1-2: Set up Upstash, implement rate limiting
- Day 3-4: Add brute force protection
- Day 5: Add security headers
- Day 6-7: Testing and fixes

### Week 2 (Enhanced)
- Day 1-2: CSRF protection for sensitive routes
- Day 3-4: Request size validation
- Day 5: Dependency scanning setup
- Day 6-7: End-to-end security testing

### Week 3 (Verification)
- Day 1-3: Penetration testing
- Day 4-5: Fix any issues found
- Day 6-7: Documentation and training

---

## Post-Implementation Monitoring

**Key Metrics to Track:**
1. Rate limit rejections (should be low after initial period)
2. Account lockouts (monitor for legitimate user issues)
3. Security header compliance (use securityheaders.com)
4. Vulnerability scan results (npm audit)

**Alert On:**
- Unusual spike in rate limit hits
- Many account lockouts from single IP
- Security audit failures
- New CVEs in dependencies

---

## Future Enhancements (Phase 3)

1. **CAPTCHA Integration** - Add to login after 3 failed attempts
2. **IP Reputation Check** - Block known bad IPs
3. **DDoS Protection** - Cloudflare integration
4. **WAF Rules** - Web Application Firewall
5. **2FA/MFA** - Multi-factor authentication
6. **Security Monitoring** - Real-time threat detection
