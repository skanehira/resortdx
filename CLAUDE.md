# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ResortDX is a resort/ryokan (Japanese inn) operations management system built as a React SPA. It provides interfaces for:
- **Admin portal**: Dashboard, task templates, staff monitoring, equipment/shuttle/meal/celebration management, settings
- **Staff mobile view**: Unified task list, messaging, chat, timeline, schedule, shared notes
- **Guest portal**: Shuttle status tracking, meal status, general portal

## Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build
npm run lint     # Run oxlint with --deny-warnings
npm run fmt      # Format src/ with oxfmt
npm run check    # Format + lint + TypeScript check (run before commits)
```

## Tech Stack

- React 19 with TypeScript
- Vite 7 (bundler)
- Tailwind CSS 4 (styling)
- react-router-dom 7 (HashRouter for GitHub Pages deployment)
- react-i18next (i18n with Japanese/English support)
- oxlint/oxfmt (linting/formatting)

## Architecture

### Routing Structure

App uses HashRouter with three main route groups:
- `/login` - Authentication
- `/admin/*` - Admin pages (protected, requires admin role)
- `/staff/*` - Staff mobile views (protected)
- `/guest/*` - Guest-facing pages (public)

### State Management

State is managed at the `StaffPages` component level (`src/App.tsx`), which holds:
- `unifiedTasks` - All task data
- `messages` - Staff messages
- `staffNotes` - Shared notes
- `roomAmenities` / `roomEquipment` - Room inventory

Handlers are passed down as props to child components.

### Type System

Core types in `src/types/index.ts`:
- `UnifiedTask` - Central task type that unifies housekeeping, meal, shuttle, celebration, and help request tasks
- `UnifiedTaskType` - Discriminated union: `housekeeping` | `meal` | `shuttle` | `celebration` | `help_request`
- Type-specific data via optional fields: `housekeeping?`, `meal?`, `shuttle?`, `celebration?`, `helpRequest?`

### i18n Structure

Translations in `src/i18n/locales/{ja,en}/`:
- `common.json` - Shared strings
- `admin.json` - Admin UI
- `staff.json` - Staff UI
- `guest.json` - Guest UI
- `types.json` - Domain type labels
- `auth.json` - Authentication

### Component Organization

```
src/components/
├── admin/       # Admin dashboard and management components
├── staff/       # Staff mobile views and task cards
│   ├── cards/   # Task-type-specific card components (MealCard, ShuttleCard, etc.)
│   └── modals/  # Staff modal dialogs
├── guest/       # Guest-facing components
├── shared/      # Components used across admin/staff/guest
├── auth/        # Login and protected route components
├── shuttle/     # Shuttle-specific messaging components
└── ui/          # Reusable UI primitives (Modal, Icons, etc.)
```

### Mock Data

Development uses mock data from `src/data/mock/`:
- `unifiedTasks.ts` - Sample tasks
- `staff.ts` - Staff members
- `auth.ts` - User accounts
- Various other domain data

## Deployment

Configured for GitHub Pages deployment at `/resortdx/` base path (see `vite.config.ts`).
