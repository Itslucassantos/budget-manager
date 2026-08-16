# Budget Manager

> ## Study Project Notice
>
> This project was built **for study purposes only** so I can practice and apply my frontend knowledge.
>
> Because this is an educational project, some information is stored in **localStorage** (for example: user/session-related data, budget values, and app settings).
>
> It is **not intended for production use** and should be treated as a learning sandbox.

A modern personal finance frontend application built with React + TypeScript.

It allows users to:

- Register/Login (including Google login)
- Manage expenses (create, edit, delete)
- Filter/search expense data
- Visualize budget insights and monthly trends
- Configure spreadsheet integration URL in settings

## Demo Video

Video URL here:

- [Watch the demo video](https://drive.google.com/file/d/1YRlOXJe5pN6wa5hgIlxVDcUHfOE4H8x5/view?usp=sharing)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Main Features](#main-features)
3. [Tech Stack](#tech-stack)
4. [Project Architecture](#project-architecture)
5. [Folder Organization](#folder-organization)
6. [How Data Is Stored](#how-data-is-stored)
7. [Requirements](#requirements)
8. [Environment Variables](#environment-variables)
9. [Run Locally](#run-locally)
10. [Available Scripts](#available-scripts)
11. [Application Flow](#application-flow)
12. [Important Notes and Limitations](#important-notes-and-limitations)
13. [Future Improvements](#future-improvements)

## Project Overview

Budget Manager is a frontend-only finance dashboard focused on expense management and budget tracking.

The app was designed to practice:

- React component composition
- State management with Context API
- Data fetching/caching with React Query
- Form validation with React Hook Form + Zod
- Route protection
- Reusable UI and folder modularization

## Main Features

- Authentication UI flow:
  - Email/password flow (study/demo behavior)
  - Google OAuth login
- Protected pages:
  - Dashboard
  - Expenses
  - Settings
- Expense management:
  - List expenses
  - Search and filter by category
  - Pagination
  - Add/Edit/Delete via modal dialogs
- Dashboard analytics:
  - Budget, total spent, remaining/over-budget
  - Average ticket value
  - Top category
  - Monthly expenses chart
  - Date-based filters (today, last 7/30 days, this month, custom range)
- Settings:
  - Monthly budget configuration
  - Sheets2API URL configuration

## Tech Stack

### Core

- React 19
- TypeScript
- Vite
- React Router

### UI/UX

- Tailwind CSS
- Headless UI
- React Icons
- React Hot Toast

### Data and Forms

- TanStack React Query
- React Hook Form
- Zod + @hookform/resolvers

### Authentication Utilities (study context)

- Google OAuth (`@react-oauth/google`)
- JWT decode (`jwt-decode`)
- `bcryptjs` (used in local study flow)
- `uuid`

### Code Quality

- ESLint

## Project Architecture

This project follows a **modular frontend architecture** with clear separation of concerns.

### Layers

- Routing Layer
  - Defines public/private routes and page entry points.

- Page Layer
  - Page-level composition and orchestration (`dashboard`, `expenses`, `settings`, `login`, `register`).

- Component Layer
  - Reusable and feature-scoped UI components (tables, cards, modals, menus, layout shell).

- Domain/Logic Layer
  - Utility functions for analytics, date conversion, and formatting.

- Data Access Layer
  - API client functions and data hooks (`api`, `hooks`) for querying/mutating expense data.

- App Infrastructure Layer
  - Global providers (Auth, Router, QueryClient, OAuth, Toaster) and shared constants.

### Architectural Decisions

- React Query centralizes server-state fetching/caching.
- Context API manages auth state for protected routes.
- Utility modules keep business calculations outside UI components.
- Shared layout/navigation components reduce duplication.

## Folder Organization

```text
src/
  api/                 # API URL utilities and request client(s)
  components/          # Reusable UI and feature components
    appShell/          # Shared private-page layout (sidebar + mobile menu + content area)
    budgetTable/       # Expense table + create/edit/delete modals
    card/              # Dashboard metric card
    input/             # Reusable form input component
    mobileMenu/        # Mobile navigation menu
    modalDeleteAccount/# Account deletion modal
    monthlySchedule/   # Monthly chart/schedule visualization
    navigationLinks/   # Shared nav links used by desktop/mobile menu
    sidebarDesktop/    # Desktop sidebar
  constants/           # Shared constants (categories, labels)
  contexts/            # React contexts/providers (auth)
  hooks/               # Custom hooks (React Query wrappers)
  lib/                 # Shared library setup (query client)
  pages/               # Route pages (dashboard, expenses, settings, auth pages)
  routes/              # Route guards (private routes)
  utils/               # Pure utility/business logic (date, analytics)
  App.tsx              # Router configuration
  main.tsx             # Application bootstrap and providers
```

## How Data Is Stored

This is intentionally simple due to study scope:

- `localStorage` stores:
  - User/auth study data
  - Budget amount
  - Sheets2API URL
- Expense records are loaded/manipulated via configured Sheets2API endpoint.

Again: this storage strategy is acceptable for learning but **not production-grade security**.

## Requirements

- Node.js 18+
- npm 9+

## Environment Variables

Create a `.env` file in the project root with:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_DEFAULT_SHEET2_BASE_URL=https://your-sheets2api-endpoint
```

Notes:

- `VITE_DEFAULT_SHEET2_BASE_URL` is the default expenses API base URL.
- Users can override the API URL in Settings, which is stored in localStorage.

## Run Locally

1. Clone the repository

```bash
git clone <your-repository-url>
cd budget-manager
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
# create .env and add required VITE_* variables
```

4. Start development server

```bash
npm run dev
```

5. Open in browser

```text
http://localhost:5173
```

## Available Scripts

- `npm run dev`
  - Starts Vite dev server.
- `npm run build`
  - Runs TypeScript build and generates production assets.
- `npm run lint`
  - Runs ESLint.
- `npm run preview`
  - Serves the production build locally for preview.

## Application Flow

1. App bootstraps providers in `main.tsx`:
   - OAuth provider
   - React Query provider
   - Toast provider
   - Auth provider
   - Router provider

2. Router in `App.tsx` defines:
   - Public routes: `/`, `/register`
   - Private routes: `/dashboard`, `/expenses`, `/settings`

3. Private route guard checks auth context before rendering protected pages.

4. Expense pages consume API hooks and business utilities:
   - Fetching/caching through React Query
   - Transformation/analytics through `utils/expenseAnalytics.ts`

## Important Notes and Limitations

- This project is educational and frontend-focused.
- Authentication/storage patterns are simplified for learning.
- Some logic depends on localStorage values.
- Not intended for production security/compliance requirements.

## Future Improvements

- Add backend authentication and token lifecycle
- Replace localStorage auth strategy with secure server-side flow
- Add automated tests (unit + integration + e2e)
- Add CI pipeline (lint/build/test)
- Improve bundle splitting and performance optimization
- Improve accessibility auditing and keyboard navigation coverage
