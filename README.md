# Next Click ERP - Enterprise Management Suite

A modern, full-stack Enterprise Resource Planning (ERP) application built with Next.js, TypeScript, and Supabase.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Database:** Supabase
- **State Management:** TanStack Query
- **Data Tables:** TanStack Table
- **Authentication:** NextAuth v5
- **Email:** Resend
- **Validation:** Zod
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel

## Features

- 🎨 Modern UI with Dark/Light theme support
- 👥 Client Management System
- 📊 Dashboard with AI-Powered Insights
- 🤝 Live Collaboration
- 📈 Analytics and Reporting
- 🔐 Secure Authentication
- 📱 Responsive Design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Resend account (for email)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextclick-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

- Supabase URL and keys
- NextAuth secret
- Resend API key

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   └── ui/          # Shadcn/ui components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configs
├── types/           # TypeScript type definitions
└── __tests__/       # Jest tests
```

## Development Guidelines

### Component Naming

- Use PascalCase: `ThisComponent.tsx`

### File Naming

- Use camelCase: `dateFormatter.ts`, `usePayment.ts`

### Component Rules

- Maximum 50 lines per component
- Split into smaller components if needed
- Place new files close to related code (colocation)
- Make reusable later as needed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

## Modules (Planned)

### Phase 1 (Current)

- Dashboard
- Client Management
- Authentication

### Phase 2 (Future)

- HR Management
- Document Center
- Project Management
- Billing Management
- Service Catalog
- Service Management
- Security Center

## License

Private - All rights reserved
