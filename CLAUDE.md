# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Runs Next.js development server with Turbopack
- **Build**: `npm run build` - Creates production build with Turbopack
- **Start**: `npm start` - Starts production server
- **Lint**: `npm run lint` - Runs ESLint for code quality checks

## Architecture Overview

This is a Next.js 15 application using the App Router architecture with a sophisticated dual-cookie authentication system and modern UI components.

### Core Technologies

- **Framework**: Next.js 15.5.2 with App Router
- **React**: 19.1.0
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables approach
- **Authentication**: Appwrite (node-appwrite) with custom JWT system
- **Form Handling**: React Hook Form with Yup validation
- **Encryption**: JOSE for JWT signing/verification
- **Icons**: Lucide React

## Authentication Architecture

This application implements a sophisticated dual-cookie authentication system that ensures security and user session consistency:

### Dual Cookie System
- **`localSession` Cookie**: Contains encrypted JWT with user session data (encrypted with JOSE)
- **`appSession` Cookie**: Contains Appwrite session token for backend API calls
- **Critical Rule**: Both cookies must exist together or both are automatically deleted to maintain consistency

### Authentication Flow
1. **Login**: Creates both `localSession` (JWT) and `appSession` (Appwrite) cookies
2. **Middleware Validation**: Custom middleware (`middleware.js`) validates JWT on `/auth` routes
3. **Cookie Refresh**: `updateLocalSessionCookie.jsx` validates and refreshes expired JWTs
4. **Synchronized Logout**: If either cookie becomes invalid, both are deleted and user is logged out
5. **Client-Side Monitoring**: Navbar component polls cookies every 5 seconds to detect backend logout

### Key Authentication Components
- **`/middleware.js`**: Route protection and cookie validation
- **`/components/middleware/updateLocalSessionCookie.jsx`**: JWT validation and refresh
- **`/middleware/encrypt.jsx`** & **`/middleware/decript.jsx`**: JWT encryption utilities
- **`/appwrite/utils/client.jsx`**: Appwrite session and admin client creation
- **`/components/navbar/navBar.jsx`**: Real-time authentication state synchronization

## Project Structure

```
app/                    # Next.js App Router pages
├── layout.jsx          # Root layout with theme provider
├── page.jsx            # Home page
├── auth/
│   └── onboarding/     # Protected onboarding flow
├── freelancer/         # Freelancer-related pages
├── login/              # Authentication pages
└── signup/

components/             # Reusable components
├── ui/                 # shadcn/ui component library (35+ components)
├── navbar/             # Navigation with authentication state
├── OnboardingStepper/  # Multi-step onboarding flow
└── middleware/         # Authentication middleware components

appwrite/               # Backend integration
└── utils/             # Server actions for Appwrite operations
    ├── client.jsx     # Session and admin clients
    ├── getCurrentUser.jsx
    ├── loginUser.jsx
    └── logoutUser.jsx

middleware/             # JWT encryption system
├── encrypt.jsx        # JWT signing with JOSE
└── decript.jsx       # JWT verification with JOSE
```

## Key Conventions

### Component Architecture
- Use `.jsx` extension for React components (configured via components.json)
- Follow shadcn/ui "new-york" style convention with Radix UI primitives
- Components use CSS variables for theming (`--color-primary`, `--color-background`, etc.)
- Server components for pages, client components for interactive elements

### Authentication Patterns
- **Server Actions**: All Appwrite operations use Next.js server actions pattern
- **Cookie Management**: Always handle both `localSession` and `appSession` together
- **JWT Structure**: Contains `userId`, `provider`, `providerUid`, `countryName`, and expiration
- **Environment Variables**: Requires `NEXT_PUBLIC_APPWRITE_ENDPOINT`, `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `API_KEY`, `JWT_KEY`

### Styling System
- **Tailwind CSS v4**: Uses CSS variables approach for theming
- **Theme Provider**: next-themes with light/dark mode support
- **Component Styling**: Use `cn()` utility from `@/lib/utils` for conditional classes
- **Custom Animations**: Custom keyframes for sheet transitions and UI interactions

### Form Handling
- **React Hook Form**: Primary form library with resolver pattern
- **Validation**: Yup schemas for form validation
- **UI Integration**: Forms integrate with shadcn/ui form components

### Path Aliases (configured in components.json)
- `@/components` → components directory
- `@/lib` → lib directory
- `@/hooks` → hooks directory
- `@/components/ui` → UI component library
- `@/appwrite` → Appwrite utilities

## Critical Development Notes

### Authentication State Management
- The navbar component (`components/navbar/navBar.jsx`) contains sophisticated cookie monitoring
- It polls cookies every 5 seconds and responds to window focus/visibility changes
- Any authentication changes require understanding the dual-cookie synchronization system

### Middleware System
- Custom middleware runs on all `/auth` routes to validate JWT cookies
- Cookie refresh happens automatically via `updateLocalSessionCookie.jsx`
- Failed validation results in automatic logout and cookie cleanup

### Onboarding Flow
- Multi-step component system in `components/OnboardingStepper/`
- Separate flows for different user types (freelancer vs client steps)
- State management across steps with parent stepper component

### UI Component System
- 35+ shadcn/ui components pre-configured with "new-york" style
- Custom components like `star-rating`, `stepper` for business logic
- Consistent theme variables across light/dark modes
- Custom animation utilities for enhanced UX

## Development Workflow

1. **Authentication Changes**: Always test both cookie creation and deletion flows
2. **UI Development**: Use existing shadcn/ui components before creating custom ones  
3. **Server Actions**: Follow the pattern in `/appwrite/utils/` for backend operations
4. **Middleware Updates**: Changes to JWT validation may require updating both encrypt/decrypt utilities
5. **Theme Development**: Use CSS variables defined in `globals.css` for consistent theming