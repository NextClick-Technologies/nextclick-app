# Frontend Integration Guide

## 🎉 Completed Integration

The frontend has been successfully integrated with the backend API. Here's what was implemented:

## ✅ What's Been Done

### 1. **TanStack Query Setup**
- ✅ Created `QueryProvider` component
- ✅ Added to root layout with proper configuration
- ✅ Configured stale time and refetch settings

### 2. **API Hooks** (`/src/hooks/useApi.ts`)
Created comprehensive hooks for all 7 entities:
- ✅ **Clients**: `useClients`, `useClient`, `useCreateClient`, `useUpdateClient`, `useDeleteClient`
- ✅ **Companies**: `useCompanies`, `useCompany`, `useCreateCompany`, `useUpdateCompany`, `useDeleteCompany`
- ✅ **Projects**: `useProjects`, `useProject`, `useCreateProject`, `useUpdateProject`, `useDeleteProject`
- ✅ **Milestones**: `useMilestones`, `useMilestone`, etc.
- ✅ **Payments**: `usePayments`, `usePayment`, etc.
- ✅ **Employees**: `useEmployees`, `useEmployee`, etc.
- ✅ **Communication Logs**: `useCommunicationLogs`, `useCommunicationLog`, etc.

All hooks support:
- Pagination
- Filtering
- Sorting
- Automatic cache invalidation
- Loading states
- Error handling

### 3. **Page Integration**

#### **Clients Page** (`/clients`)
- ✅ Fetches real data from `/api/client`
- ✅ Search functionality
- ✅ Loading states with skeleton UI
- ✅ Error handling
- ✅ Create new clients via dialog
- ✅ Real-time metrics (total, gender breakdown)

#### **Companies Page** (`/companies`)
- ✅ Fetches real data from `/api/company`
- ✅ Search functionality
- ✅ Loading states
- ✅ Error handling
- ✅ Create new companies via dialog
- ✅ Real-time metrics

#### **Projects Page** (`/projects`)
- ✅ Fetches real data from `/api/project`
- ✅ Search functionality
- ✅ Loading states
- ✅ Error handling
- ✅ Create new projects via dialog
- ✅ Client selection dropdown (fetches from API)
- ✅ Real-time metrics (active, completed, budget)

### 4. **Authentication**
- ✅ NextAuth SessionProvider setup
- ✅ Sign-in page (`/auth/signin`)
- ✅ Sign-out page (`/auth/signout`)
- ✅ User dropdown in header with sign-out button
- ✅ Protected routes via middleware

## 🚀 How to Use

### Starting the App

1. **Ensure environment variables are set** (`.env.local`):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Access the app**:
   - Navigate to `http://localhost:3000/auth/signin`
   - For testing, you can create an employee in Supabase or update the auth logic

### Testing the Integration

1. **Test Clients Page**:
   - Go to `/clients`
   - Try adding a new client
   - Use the search functionality
   - Verify data loads from API

2. **Test Companies Page**:
   - Go to `/companies`
   - Add a new company
   - Search and filter

3. **Test Projects Page**:
   - Go to `/projects`
   - Create a project (requires existing clients)
   - Verify client dropdown populates from API

## 📁 File Structure

```
src/
├── app/
│   ├── (clients)/
│   │   ├── clients/
│   │   │   ├── components/
│   │   │   │   ├── AddClientDialog.tsx (✅ API integrated)
│   │   │   │   └── ClientTable.tsx (✅ Updated for API types)
│   │   │   └── page.tsx (✅ API integrated)
│   │   ├── companies/
│   │   │   ├── components/
│   │   │   │   ├── AddCompanyDialog.tsx (✅ New)
│   │   │   │   └── CompanyTable.tsx (✅ New)
│   │   │   └── page.tsx (✅ New - API integrated)
│   │   └── projects/
│   │       ├── components/
│   │       │   ├── AddProjectDialog.tsx (✅ New)
│   │       │   └── ProjectTable.tsx (✅ New)
│   │       └── page.tsx (✅ New - API integrated)
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx (✅ New)
│   │   └── signout/
│   │       └── page.tsx (✅ New)
│   ├── api/ (Backend routes - already created)
│   └── layout.tsx (✅ Updated with providers)
├── components/
│   └── layout/
│       └── Header.tsx (✅ Added user menu & sign-out)
├── hooks/
│   └── useApi.ts (✅ New - all entity hooks)
├── providers/
│   ├── QueryProvider.tsx (✅ New)
│   └── SessionProvider.tsx (✅ New)
└── types/
    └── database.ts (Already exists)
```

## 🎯 Key Features

### Data Fetching
- Automatic caching via TanStack Query
- Smart refetching on window focus (disabled)
- 1-minute stale time for optimal performance
- Pagination support (page, pageSize)

### Form Handling
- Real-time validation
- Loading states during submission
- Automatic list refresh after create/update/delete
- Error handling with user feedback

### UI/UX
- Loading skeletons for better perceived performance
- Empty states when no data
- Error states with helpful messages
- Search functionality with real-time filtering

## 🔧 Next Steps (Optional Enhancements)

1. **Add Edit/Delete Functionality**
   - Add edit dialogs for each entity
   - Implement delete confirmations
   - Use `useUpdateClient`, `useDeleteClient`, etc.

2. **Advanced Filtering**
   - Add filter dropdowns (status, gender, etc.)
   - Date range filters for projects
   - Multi-select filters

3. **Pagination UI**
   - Add previous/next buttons
   - Show page numbers
   - Items per page selector

4. **Real-time Updates**
   - Add Supabase real-time subscriptions
   - Show toast notifications on changes
   - Optimistic updates

5. **Better Error Handling**
   - Toast notifications for errors
   - Retry buttons
   - Offline mode detection

6. **Performance Optimizations**
   - Implement virtual scrolling for large lists
   - Add debouncing to search
   - Optimize re-renders with React.memo

## 🐛 Troubleshooting

### "Failed to fetch data" Error
- Check if the dev server is running
- Verify environment variables are set
- Check Supabase connection
- Look at browser console for specific errors

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set
- Verify employee exists in Supabase database
- Check that email matches exactly

### Empty Lists
- Verify database has data
- Check API routes are responding (check Network tab)
- Ensure no filters are applied

## 📝 Notes

- All API calls are client-side (using `"use client"`)
- Authentication state is managed via NextAuth
- Data caching is handled by TanStack Query
- TypeScript types are automatically inferred from database types
