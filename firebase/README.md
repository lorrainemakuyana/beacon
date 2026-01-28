# Firebase Configuration

This directory contains Firebase configuration for backend services only (no hosting).

## 🆓 Free Tier Backend Services

This configuration uses **only Firebase free tier backend services**:

- ✅ **Firestore Database** - Real-time NoSQL database
- ✅ **Authentication** - User authentication and management
- ✅ **Storage** - File storage for images and documents
- ❌ **Hosting** - Not used (host web app on your preferred platform)

## Files

- `firebase.json` - Main Firebase configuration (backend only)
- `.firebaserc` - Project aliases for different environments
- `firestore.rules` - Database security rules
- `firestore.indexes.json` - Database indexes for query optimization
- `storage.rules` - File storage security rules

## Setup

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `beacon-core-platform-dev`
3. Enable these services:
   - **Authentication** → Email/Password
   - **Firestore Database** → Start in test mode
   - **Storage** → Start in test mode
   - **DO NOT enable Hosting** (you'll host elsewhere)

### 4. Initialize Project

```bash
cd firebase
firebase use beacon-core-platform-dev
```

## Development

### Start Emulators

```bash
# From project root
npm run firebase:emulators

# Or from firebase directory
firebase emulators:start
```

Access emulator UI at: http://localhost:4000

### Deploy Backend Services

```bash
# Deploy database rules and indexes (FREE)
firebase deploy --only firestore

# Deploy storage rules (FREE)
firebase deploy --only storage

# Deploy both
firebase deploy --only firestore,storage
```

## Web App Hosting Options

Since you're not using Firebase Hosting, here are popular alternatives:

### Free Hosting Options

**Vercel (Recommended for Next.js)**

```bash
cd web
npm install -g vercel
vercel
```

**Netlify**

```bash
cd web
npm run build
# Upload dist folder to Netlify
```

**Railway**

```bash
cd web
# Connect GitHub repo to Railway
```

**Render**

```bash
cd web
# Connect GitHub repo to Render
```

### Paid Hosting Options

**AWS Amplify**

```bash
cd web
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
```

**DigitalOcean App Platform**

```bash
# Connect GitHub repo to DigitalOcean
```

## Environment Variables for External Hosting

When hosting on external platforms, set these environment variables:

```bash
# Required for all platforms
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Free Tier Limits (Backend Only)

### Firestore

- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day
- **Storage**: 1 GiB

### Authentication

- **Monthly Active Users**: 50,000

### Storage

- **Stored**: 5 GB
- **Downloaded**: 1 GB/day

## Security Rules

### Firestore Rules (`firestore.rules`)

- Users can only access their own data
- Event access based on coordinator/collaborator roles
- Attendance records restricted to volunteers and coordinators
- Incident reports visible to reporters and coordinators

### Storage Rules (`storage.rules`)

- User profile images restricted to account owners
- Incident photos accessible to reporters and coordinators
- Organization assets managed by organization members

## Monitoring

Monitor backend usage through Firebase Console (free):

- **Authentication**: User activity and sign-in methods
- **Firestore**: Database usage and performance
- **Storage**: File usage and access patterns

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check Firestore security rules
   - Verify user authentication status
   - Ensure user has correct role/permissions

2. **Emulator Connection Issues**
   - Check if ports 4000, 8080, 9099, 9199 are available
   - Restart emulators: `firebase emulators:start`

3. **Deployment Errors**
   - Verify Firebase project is selected: `firebase use --list`
   - Check Firebase CLI is logged in: `firebase login --list`
   - Ensure services are enabled in Firebase Console

4. **CORS Issues with External Hosting**
   - Add your hosting domain to Firebase Auth authorized domains
   - Go to Firebase Console → Authentication → Settings → Authorized domains

### Getting Help

- Firebase Console: https://console.firebase.google.com
- Firebase Documentation: https://firebase.google.com/docs
- Emulator UI: http://localhost:4000 (when running)
