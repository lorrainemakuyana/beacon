# Authentication Usage Examples

## Auto-Navigation

The `AuthContext` automatically handles navigation based on auth state:

- When user logs in → navigates to `/(tabs)` (home)
- When user logs out → navigates to `/auth` (login)
- On app start → checks auth state and navigates accordingly

## Method 1: Using `withAuth` HOC (Recommended)

Wrap your component with `withAuth` to protect the entire screen:

```tsx
import { withAuth, useAuth } from "@/context/AuthContext";

function MyProtectedScreen() {
  const { userProfile, logout } = useAuth();

  return (
    <View>
      <Text>Welcome {userProfile?.displayName}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

// Export the wrapped component
export default withAuth(MyProtectedScreen);
```

## Method 2: Using `useAuth` Hook

Check auth state manually in your component:

```tsx
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";

export default function MyScreen() {
  const { isAuthenticated, loading, userProfile } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Hello {userProfile?.displayName}</Text>
    </View>
  );
}
```

## Method 3: Using `useAuthGuard` Hook (Role-Based)

Check if user has required role:

```tsx
import { useAuthGuard } from "@/context/AuthContext";

export default function AdminScreen() {
  const { canAccess, loading } = useAuthGuard();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!canAccess("coordinator")) {
    return <Text>Access Denied: Coordinator role required</Text>;
  }

  return (
    <View>
      <Text>Admin Dashboard</Text>
    </View>
  );
}
```

## Role Hierarchy

- `volunteer` (level 0) - Basic access
- `collaborator` (level 1) - Can collaborate on events
- `coordinator` (level 2) - Can manage events
- `owner` (level 3) - Full access

## Available Auth Functions

```tsx
const {
  // State
  user, // Firebase user object
  userProfile, // User profile from Firestore
  loading, // Auth loading state
  error, // Auth error message
  isAuthenticated, // Boolean: is user logged in?

  // Actions
  login, // (email, password) => Promise<void>
  register, // (email, password, firstName, lastName) => Promise<void>
  loginWithGoogle, // () => Promise<void> (not yet implemented)
  logout, // () => Promise<void>
  resetPassword, // (email) => Promise<void>

  // Utilities
  refreshUserProfile, // () => Promise<void>
  clearError, // () => void
} = useAuth();
```

## Example: Protected Tab Screen

```tsx
// mobile/app/(tabs)/profile.tsx
import { withAuth, useAuth } from "@/context/AuthContext";
import { View, Text, Button } from "react-native";

function ProfileScreen() {
  const { userProfile, logout } = useAuth();

  return (
    <View>
      <Text>Name: {userProfile?.displayName}</Text>
      <Text>Email: {userProfile?.email}</Text>
      <Text>Role: {userProfile?.role}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

export default withAuth(ProfileScreen);
```

## Example: Login Screen (No Protection Needed)

```tsx
// mobile/app/auth/index.tsx
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      // Navigation happens automatically in AuthContext
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
    </View>
  );
}
```
