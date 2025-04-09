import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, sendEmailVerification  } from 'firebase/auth'
import { auth, provider } from './firebase'

// Email/Password Registration
export const signUpWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  await sendEmailVerification(userCredential.user) // 👈 Send the email
  return userCredential.user
}

// Email/Password Login
export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

// Google Sign In
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

// Update profile (for profile page)
export const updateUserProfile = async (displayName: string, photoURL: string) => {
  const user = auth.currentUser
  if (user) {
    await updateProfile(user, { displayName, photoURL })
  }
}
