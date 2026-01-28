# Beacon Core Platform

A mobile-first volunteer operations platform that streamlines volunteer event management through real-time coordination, attendance tracking, and incident reporting.

## Repository Structure

This is a monorepo containing the following packages:

```
/
├── shared/                 # Shared components and utilities
│   ├── src/
│   │   ├── types/         # TypeScript interfaces and data models
│   │   ├── constants/     # Shared constants, colors, and design tokens
│   │   └── utils/         # Common utility functions
│   └── package.json
├── mobile/                # React Native mobile app
│   ├── src/
│   └── package.json
├── web/                   # Next.js web dashboard
│   ├── src/
│   └── package.json
├── api/                   # Firebase Cloud Functions
│   ├── src/
│   └── package.json
└── package.json           # Root package.json for workspace management
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Install dependencies for all workspaces:

   ```bash
   npm install
   ```

2. Build the shared package:
   ```bash
   npm run build --workspace=shared
   ```

### Development

- **Mobile App**: `npm run dev:mobile`
- **Web Dashboard**: `npm run dev:web`
- **API Functions**: `npm run dev:api`

### Building

Build all packages:

```bash
npm run build
```

### Testing

Run tests for all packages:

```bash
npm run test
```

## Shared Package

The `@beacon/shared` package contains:

- **Types**: TypeScript interfaces for User, Event, Shift, Attendance, Incident, and more
- **Constants**: Colors, design tokens, app configuration, and validation rules
- **Utils**: Date formatting, validation, permissions, array operations, and more

All other packages import from `@beacon/shared` to ensure consistency across platforms.

## Architecture

- **Frontend**: React Native (mobile) and React/Next.js (web)
- **Backend**: Firebase (Firestore, Auth, Functions, Storage)
- **Payments**: Stripe integration
- **Real-time**: Firestore real-time listeners

## License

Private - All rights reserved
