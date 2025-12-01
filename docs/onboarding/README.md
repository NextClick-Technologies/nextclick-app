# Onboarding Guide - Getting Started

Welcome to the Next Click ERP project! This guide will help you get started quickly.

## 👋 Welcome!

We're excited to have you on the team. This documentation is organized to help you onboard based on your role:

- **Everyone:** Read this page first (you are here)
- **Frontend Developers:** See [Frontend Guide](FRONTEND.md)
- **Backend Developers:** See [Backend Guide](BACKEND.md)
- **Full-Stack:** Read both guides above

## 📋 Quick Start Checklist

Complete these steps regardless of your role:

- [ ] Clone repository and install dependencies
- [ ] Set up `.env.local` with required variables ([see README](../../README.md#installation))
- [ ] Run `npm run dev` to start development server
- [ ] Open [http://localhost:3000](http://localhost:3000) and verify it works
- [ ] Read the main [README](../../README.md) completely
- [ ] Review [Development Guidelines](../../README.md#-development-guidelines)
- [ ] Read your specialized guide ([Frontend](FRONTEND.md) or [Backend](BACKEND.md))
- [ ] Look at existing code in your area
- [ ] Join team communication channels
- [ ] Introduce yourself to the team!

## 🏗️ Project Overview

### What is Next Click ERP?

Next Click is a modern, full-stack Enterprise Resource Planning (ERP) application that helps organizations manage:
- Client relationships
- Projects and tasks
- Employees and HR
- Documents and files
- Billing and payments

### Tech Stack at a Glance

**Frontend:**
- Next.js 16 (React framework with App Router)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Shadcn/ui (component library)

**Backend:**
- Next.js API Routes (serverless functions)
- Supabase (PostgreSQL database)
- NextAuth v5 (authentication)
- Pino (structured logging)

**Infrastructure:**
- Vercel (deployment)
- Discord (error notifications)
- Jira (issue tracking)

### Project Structure

```
nextclick-app/
├── src/
│   ├── app/              # Next.js pages & API routes
│   │   ├── (dashboard)/  # Protected pages (requires login)
│   │   ├── api/          # Backend API endpoints
│   │   └── auth/         # Authentication pages
│   ├── components/       # Reusable React components
│   ├── lib/              # Backend utilities & configs
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── docs/                 # Documentation (you are here!)
└── scripts/              # Build & dev scripts
```

## 🔑 Key Concepts

### Server vs Client Components

Next.js uses **Server Components by default** (new in App Router):
- Server Components render on the server (faster, better SEO)
- Client Components use `'use client'` directive (for interactivity)
- Only use Client Components when you need:
  - React hooks (`useState`, `useEffect`)
  - Event handlers (`onClick`, `onChange`)
  - Browser APIs (`window`, `localStorage`)

### File-Based Routing

Files in `src/app/` automatically become routes:
- `src/app/clients/page.tsx` → `/clients`
- `src/app/projects/[id]/page.tsx` → `/projects/123`
- `src/app/api/users/route.ts` → `/api/users`

### Authentication

All protected routes require authentication:
- NextAuth v5 handles authentication
- Session stored in cookies
- Middleware checks auth on protected routes

## 🔄 Development Workflow

### 1. Pick a Task

- Check team board for assigned tasks
- Choose something appropriate for your skill level
- Ask questions if requirements are unclear

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code improvements
- `docs/` - Documentation updates

### 3. Make Changes

Follow these guidelines:
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Keep files focused and small
- Update tests if needed

### 4. Test Thoroughly

```bash
npm run dev          # Test locally
npm run lint         # Check for errors
npm test             # Run unit tests
npm run build        # Verify build works
```

### 5. Commit Changes

Use **conventional commits**:

```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create Pull Request with:
- Clear title describing the change
- Description of what and why
- Screenshots for UI changes
- Link to related issues

### 7. Code Review

- Respond to feedback promptly
- Make requested changes
- Discuss disagreements constructively
- Merge after approval

## 🧪 Testing

### Unit Tests

We use Jest for unit testing:

```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### E2E Tests

We use Playwright for end-to-end testing:

```bash
npm run test:e2e        # Headless mode
npm run test:e2e:ui     # With UI
npm run test:e2e:debug  # Debug mode
```

## 📝 Code Standards

### General Rules

- **TypeScript:** Use proper types, avoid `any`
- **Naming:** Use descriptive names (no single letters)
- **Comments:** Explain why, not what
- **DRY:** Don't repeat yourself
- **KISS:** Keep it simple

### Component Rules

- Maximum 50 lines per component
- One component per file
- Use PascalCase for files: `UserMenu.tsx`
- Export as named export: `export function UserMenu()`

### API Route Rules

- Wrap with `withErrorMonitoring()`
- Validate all inputs with Zod
- Check authentication first
- Return proper HTTP status codes
- Use structured logging (`logger.info()`)

## 🆘 Getting Help

### Before Asking

1. Check documentation (README, this guide, code comments)
2. Search existing code for similar patterns
3. Check error logs (terminal, browser console)
4. Google the error message
5. Try debugging for 30+ minutes

### When to Ask

- You're stuck after trying for 30+ minutes
- You need architectural guidance
- You're unsure about best approach
- You found a potential bug

### How to Ask

Good question format:
1. What you're trying to do
2. What you've tried
3. Error messages (full stack trace)
4. Relevant code snippets
5. What you've already checked

### Where to Ask

- **Quick questions:** Team chat
- **Bugs/Features:** GitHub Issues
- **Code feedback:** Pull Request reviews
- **Architecture:** Team meetings

## 📚 Essential Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
- [React Docs](https://react.dev) - React fundamentals
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling reference

### UI Components

- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Primitives
- [Lucide Icons](https://lucide.dev/) - Icons

### Backend

- [Supabase Docs](https://supabase.com/docs) - Database & auth
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Zod](https://zod.dev/) - Validation

## 🎯 Next Steps

Based on your role, continue to:

### Frontend Developers
👉 **[Read the Frontend Guide](FRONTEND.md)**

Learn about:
- Component architecture
- Styling with Tailwind
- State management
- Forms and validation
- Common frontend tasks

### Backend Developers
👉 **[Read the Backend Guide](BACKEND.md)**

Learn about:
- API route structure
- Database operations
- Authentication
- Error handling
- Common backend tasks

### Full-Stack Developers
Read both guides above to understand the complete stack.

---

**Welcome aboard! 🚀**
