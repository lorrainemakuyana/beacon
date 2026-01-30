/**
 * Authentication service using Firebase Auth
 * Handles login, registration, and user management
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
// import { getFirebaseServices } from '../firebase/config';
import { getFirebaseServices } from '../firebase/config';
import { User } from '../types';
import { COLLECTIONS } from '../firebase/types';
import { handleFirebaseError, validateEmail, sanitizeUserData } from '../firebase/utils';

const { auth, firestore } = getFirebaseServices();

// Auth state management
export interface AuthState {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  error: string | null;
}

// Login with email and password
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ user: FirebaseUser; userProfile: User }> => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Sign in with Firebase Auth
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email.toLowerCase().trim(),
      password
    );

    // Get user profile from Firestore
    const userProfile = await getUserProfile(userCredential.user.uid);

    // Update last active timestamp
    await updateLastActive(userCredential.user.uid);

    return {
      user: userCredential.user,
      userProfile: userProfile!,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'volunteer' | 'coordinator' | 'collaborator' | 'owner' = 'volunteer'
): Promise<{ user: FirebaseUser; userProfile: User }> => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!firstName.trim() || !lastName.trim()) {
      throw new Error('First name and last name are required');
    }

    // Create user with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase().trim(),
      password
    );

    const displayName = `${firstName.trim()} ${lastName.trim()}`;

    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName,
    });

    // Create user profile in Firestore
    const userProfile: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      role,
      profile: {
        phone: '',
        emergencyContact: '',
        skills: [],
        availability: [],
      },
      createdAt: serverTimestamp() as any,
      lastActive: serverTimestamp() as any,
    };

    await setDoc(
      doc(firestore, COLLECTIONS.USERS, userCredential.user.uid),
      sanitizeUserData(userProfile)
    );

    // Send email verification
    await sendEmailVerification(userCredential.user);

    return {
      user: userCredential.user,
      userProfile,
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Google Sign-In (for web)
export const loginWithGoogle = async (): Promise<{ user: FirebaseUser; userProfile: User }> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user profile exists, create if not
    let userProfile = await getUserProfile(userCredential.user.uid);
    
    if (!userProfile) {
      userProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: userCredential.user.displayName || '',
        role: 'volunteer',
        profile: {
          phone: '',
          emergencyContact: '',
          skills: [],
          availability: [],
        },
        createdAt: serverTimestamp() as any,
        lastActive: serverTimestamp() as any,
      };

      await setDoc(
        doc(firestore, COLLECTIONS.USERS, userCredential.user.uid),
        sanitizeUserData(userProfile)
      );
    } else {
      // Update last active
      await updateLastActive(userCredential.user.uid);
    }

    return {
      user: userCredential.user,
      userProfile,
    };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    await sendPasswordResetEmail(auth, email.toLowerCase().trim());
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, COLLECTIONS.USERS, uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    
    return null;
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (
  uid: string,
  updates: Partial<User>
): Promise<void> => {
  try {
    const userRef = doc(firestore, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      ...updates,
      lastActive: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Update user profile error:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

// Update last active timestamp
export const updateLastActive = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(firestore, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Update last active error:', error);
    // Don't throw error for this non-critical operation
  }
};

// Check if user is authenticated
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Auth state listener
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Resend email verification
export const resendEmailVerification = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    await sendEmailVerification(user);
  } catch (error: any) {
    console.error('Resend verification error:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Delete user account
export const deleteUserAccount = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    // Delete user profile from Firestore
    await deleteDoc(doc(firestore, COLLECTIONS.USERS, user.uid));

    // Delete Firebase Auth account
    await user.delete();
  } catch (error: any) {
    console.error('Delete account error:', error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Helper function to convert Firebase Auth errors to user-friendly messages
const getAuthErrorMessage = (error: AuthError | Error): string => {
  if ('code' in error) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/requires-recent-login':
        return 'This operation requires recent authentication. Please sign in again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
      default:
        return error.message || 'An authentication error occurred. Please try again.';
    }
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

// Validation helpers
export const validateRegistrationData = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}): string | null => {
  const { email, password, confirmPassword, firstName, lastName } = data;

  if (!firstName.trim()) {
    return 'First name is required';
  }

  if (!lastName.trim()) {
    return 'Last name is required';
  }

  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }

  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

export const validateLoginData = (data: {
  email: string;
  password: string;
}): string | null => {
  const { email, password } = data;

  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }

  if (!password) {
    return 'Password is required';
  }

  return null;
};


// Update email
// export const updateUserEmail = async (newEmail: string): Promise<void> => {
//   try {
//     const user = getCurrentUser();
//     if (!user) {
//       throw new Error('No user is currently signed in');
//     }

//     if (!validateEmail(newEmail)) {
//       throw new Error('Please enter a valid email address');
//     }

//     // Note: This requires recent authentication
//     // In a production app, you might want to re-authenticate the user first
//     await user.updateEmail(newEmail.toLowerCase().trim());

//     // Update Firestore profile
//     await updateUserProfile(user.uid, { email: newEmail.toLowerCase().trim() });

//     // Send verification email for new address
//     await sendEmailVerification(user);
//   } catch (error: any) {
//     console.error('Update email error:', error);
//     throw new Error(getAuthErrorMessage(error));
//   }
// };

// Update password
// export const updateUserPassword = async (newPassword: string): Promise<void> => {
//   try {
//     const user = getCurrentUser();
//     if (!user) {
//       throw new Error('No user is currently signed in');
//     }

//     if (!newPassword || newPassword.length < 6) {
//       throw new Error('Password must be at least 6 characters long');
//     }

//     // Note: This requires recent authentication
//     // In a production app, you might want to re-authenticate the user first
//     await user.updatePassword(newPassword);
//   } catch (error: any) {
//     console.error('Update password error:', error);
//     throw new Error(getAuthErrorMessage(error));
//   }
// };