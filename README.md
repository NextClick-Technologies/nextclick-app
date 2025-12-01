# Next Click ERP - Enterprise Management Suite

A modern, full-stack Enterprise Resource Planning (ERP) application built with Next.js, TypeScript, and Supabase, featuring comprehensive error monitoring and logging infrastructure.

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [👥 New to the Project?](#-new-to-the-project) ⭐
- [Project Structure](#-project-structure)
- [Available Scripts](#️-available-scripts)
- [Documentation](#-documentation)
- [Modules](#️-modules)
- [Development Guidelines](#-development-guidelines)
- [Deployment](#-deployment)
- [Error Monitoring](#-error-monitoring)
- [Contributing](#-contributing)

## �🚀 Tech Stack

### Core Framework
- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Runtime:** Node.js 18+

### Frontend
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui (Radix UI primitives)
- **Theme:** next-themes (Dark/Light mode)
- **Icons:** Lucide React
- **State Management:** TanStack Query v5
- **Data Tables:** TanStack Table v8
- **Forms:** React Hook Form + Zod validation

### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth v5
- **Email:** Resend
- **API:** Next.js API Routes

### Monitoring & Logging
- **Structured Logging:** Pino (JSON logs)
- **Error Monitoring:** Custom integration with:
  - Discord (Real-time notifications)
  - Jira (Automated ticket creation)
  - Supabase (Error log storage)
- **Error Classification:** Automatic severity detection (Critical, High, Medium, Low)
- **Deduplication:** Smart error grouping and counting

### Development Tools
- **Testing:** Jest + React Testing Library + Playwright
- **Type Checking:** TypeScript with concurrent watch mode
- **Linting:** ESLint
- **Process Management:** Concurrently (dev server + type checker)
- **Deployment:** Vercel

## ✨ Features

### Core Functionality
- 🎨 **Modern UI** - Clean, responsive design with Dark/Light theme support
- 👥 **Client Management** - Complete CRUD operations for client data
- 📊 **Dashboard** - Real-time insights and analytics
- 🔐 **Secure Authentication** - Email/password with NextAuth v5
- 📱 **Responsive Design** - Mobile-first approach

### Developer Experience
- 🔍 **Structured Logging** - JSON logs with Pino for better debugging
- 🚨 **Error Monitoring** - Automated error tracking and alerting
- 📝 **Type Safety** - Full TypeScript coverage
- 🧪 **Testing Suite** - Unit, integration, and E2E tests
- 🔄 **Live Reload** - Fast refresh with Turbopack

### Error Monitoring System
- **Automatic Error Capture** - API routes, client-side, and database errors
- **Smart Classification** - Severity-based routing (Critical → Discord + Jira)
- **Discord Integration** - Real-time notifications with rich embeds
- **Jira Integration** - Automatic ticket creation with full context
- **Supabase Logging** - Persistent error storage with analytics views
- **Deduplication** - Prevents spam by grouping identical errors
- **Production-Only** - Disabled in development by default

## 📋 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Resend account (for email)
- Discord webhook (optional, for error notifications)
- Jira account (optional, for automated ticketing)

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd nextclick-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Resend (Email)
RESEND_API_KEY=your-resend-key

# Error Monitoring (Optional)
ENABLE_ERROR_MONITORING=true
ERROR_MONITORING_ENVIRONMENT=production

# Discord Webhooks (Optional)
DISCORD_WEBHOOK_CRITICAL=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_HIGH=https://discord.com/api/webhooks/...

# Jira (Optional)
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=PROJECT
```

4. **Run database migrations:**

```bash
# Run SQL migrations in Supabase SQL Editor
# See: src/lib/supabase/migrations/
```

5. **Start the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 New to the Project?

**Welcome!** We're excited to have you on the team.

### Quick Start

1. ✅ Complete the [Installation](#installation) steps above
2. 📖 Read the **[Onboarding Guide](docs/onboarding)** for:
   - General overview for everyone
   - Frontend-specific guide
   - Backend-specific guide
   - Development workflow and best practices

### First Steps

- **Everyone:** Start with [General Onboarding](docs/onboarding/README.md)
- **Frontend developers:** Then read [Frontend Guide](docs/onboarding/FRONTEND.md)
- **Backend developers:** Then read [Backend Guide](docs/onboarding/BACKEND.md)
- **Full-stack:** Read both specialized guides

**📚 [Start Onboarding →](docs/onboarding)**

## �📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── (dashboard)/       # Protected dashboard routes
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components
│   ├── ErrorBoundary.tsx # React error boundary
│   └── GlobalErrorHandler.tsx # Client-side error capture
├── lib/                   # Utility functions and configs
│   ├── error-monitoring/  # Error monitoring system
│   │   ├── handler.ts    # Error classification & orchestration
│   │   ├── discord.ts    # Discord notifications
│   │   ├── jira.ts       # Jira integration
│   │   └── supabase.ts   # Error log storage
│   ├── supabase/         # Supabase client & migrations
│   ├── auth/             # Authentication utilities
│   ├── email/            # Email templates
│   └── logger.ts         # Pino logger configuration
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── contexts/             # React contexts
├── providers/            # React providers
└── __tests__/            # Jest tests
```

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start dev server with type checking and pretty logs
- `npm run dev:simple` - Start dev server only (no extras)
- `npm run dev:next-only` - Dev server with pretty logs only
- `npm run dev:tsc` - Type checker in watch mode

### Production
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:debug` - Debug E2E tests

### Code Quality
- `npm run lint` - Run ESLint

## 📚 Documentation

- **[Onboarding Guide](docs/onboarding)** - Complete guide for new contributors ⭐
  - [General Guide](docs/onboarding/README.md) - For everyone
  - [Frontend Guide](docs/onboarding/FRONTEND.md) - For frontend developers
  - [Backend Guide](docs/onboarding/BACKEND.md) - For backend developers
- **[Security Audit](docs/SECURITY_AUDIT.md)** - Security assessment and findings 🔒
- **[Security Implementation](docs/SECURITY_IMPLEMENTATION.md)** - Security hardening guide 🔒
- **[Refactoring Plan](docs/REFACTORING_PLAN.md)** - Feature-based architecture migration plan 🏗️
- [Error Monitoring Guide](docs/ERROR_MONITORING.md) - Error monitoring setup
- [Error Monitoring Testing](docs/ERROR_MONITORING_TESTING.md) - Testing guide
- [Logging Guide](docs/LOGGING.md) - Structured logging with Pino
- [Scripts Documentation](scripts/README.md) - Development scripts

## 🏗️ Modules

### ✅ Implemented
- Dashboard with analytics
- Client Management (CRUD)
- Authentication (Email/Password)
- Error Monitoring & Logging
- Theme Support (Dark/Light)

### 🚧 In Progress
- Project Management
- Employee Management
- Company Management

### 📋 Planned (Phase 2)
- HR Management
- Document Center
- Billing Management
- Service Catalog
- Service Management
- Security Center
- Performance Analytics

## 🔧 Development Guidelines

### Component Naming
- Use PascalCase: `UserMenu.tsx`, `ErrorBoundary.tsx`

### File Naming
- Use camelCase: `dateFormatter.ts`, `usePayment.ts`

### Component Rules
- Maximum 50 lines per component
- Split into smaller components if needed
- Place new files close to related code (colocation)
- Make reusable later as needed

### Error Handling
- Use `ErrorBoundary` for React component errors
- Wrap API routes with `withErrorMonitoring()`
- Use structured logger (`logger.info()`, `logger.error()`)
- Never use `console.log()` in production code

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production

Make sure to set all required environment variables in Vercel:
- Supabase credentials
- NextAuth secret and URL
- Resend API key
- Error monitoring credentials (optional)

## 📊 Error Monitoring

The application includes a comprehensive error monitoring system:

- **Automatic Capture** - All errors are automatically logged
- **Smart Classification** - Errors are classified by severity
- **Discord Alerts** - Critical/High errors trigger Discord notifications
- **Jira Tickets** - Medium+ errors create Jira tickets automatically
- **Deduplication** - Identical errors are grouped and counted
- **Analytics** - Error trends and statistics in Supabase

See [docs/ERROR_MONITORING.md](docs/ERROR_MONITORING.md) for setup instructions.

## 📝 License

Private - All rights reserved

## 🤝 Contributing

### Team Guidelines

**Before You Start:**
1. Read this README thoroughly
2. Set up your development environment
3. Understand the architecture (Frontend/Backend sections above)
4. Review existing code in your area

**Code Review Process:**
1. Create feature branch from `main`
2. Make your changes following guidelines
3. Test thoroughly (local + unit tests)
4. Create Pull Request with clear description
5. Address review feedback
6. Merge after approval

**Communication:**
- Ask questions early - don't struggle alone
- Share knowledge with the team
- Document complex decisions
- Update README/docs when needed

**Quality Standards:**
- ✅ Code follows style guidelines
- ✅ All tests pass
- ✅ No console.log() in production code
- ✅ Proper error handling
- ✅ TypeScript types are correct
- ✅ Components are under 50 lines
- ✅ API routes use error monitoring wrapper

**Need Help?**
- Check documentation first
- Review similar existing code
- Ask team members
- Create an issue for bugs/features

---

**Happy Coding! 🚀**
