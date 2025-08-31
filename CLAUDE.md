# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Runs Next.js development server with Turbopack
- **Build**: `npm run build` - Creates production build with Turbopack
- **Start**: `npm start` - Starts production server
- **Lint**: `npm run lint` - Runs ESLint for code quality checks

# Befor Runing Code

dont run "npm run dev" after you modify code, it's probably already running

## Architecture Overview

This is a Next.js 15 application using the App Router architecture with the following key technologies:

- **Framework**: Next.js 15.5.2 with App Router
- **React**: 19.1.0
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables approach
- **Form Handling**: React Hook Form with Yup/Zod validation
- **Backend**: Appwrite (node-appwrite) for backend services
- **Icons**: Lucide React

## Project Structure

```
app/                    # Next.js App Router pages
├── layout.js          # Root layout with font configuration
├── page.js            # Home page
├── login/page.jsx     # Login page
├── signup/page.jsx    # Sign up page
└── globals.css        # Global Tailwind styles

components/             # Reusable components
├── ui/                # shadcn/ui component library
│   ├── button.jsx     # Button variants
│   ├── input.jsx      # Input component
│   ├── card.jsx       # Card layouts
│   └── ...           # Other UI primitives
├── login-form.jsx     # Login form component
└── sign-up-form.jsx   # Sign up form component

lib/                   # Utilities and configurations
└── utils.js          # cn() utility for className merging

hooks/                 # Custom React hooks
└── use-mobile.js     # Mobile device detection hook
```

## Key Conventions

### Component Structure
- Use `.jsx` extension for React components (configured via components.json)
- Follow shadcn/ui "new-york" style convention
- Components use Radix UI primitives for accessibility
- Custom components in `/components`, UI primitives in `/components/ui`

### Styling Approach  
- Tailwind CSS with CSS variables for theming
- Use `cn()` utility from `@/lib/utils` for conditional className merging
- Global styles in `app/globals.css`
- Base color: neutral, supports light/dark themes

### Path Aliases
- `@/components` → components directory
- `@/lib` → lib directory  
- `@/hooks` → hooks directory
- `@/components/ui` → UI components

### Authentication
- Uses Appwrite for backend authentication services
- Login/signup forms are separate components rendered on dedicated pages
- Forms use shadcn/ui components for consistency

## Development Notes

- Uses Turbopack for faster builds and development
- ESLint configured with Next.js core web vitals rules
- Forms leverage React Hook Form for validation and state management
- Mobile-responsive design with custom mobile detection hook