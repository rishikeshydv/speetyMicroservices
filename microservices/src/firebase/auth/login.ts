import React from 'react'
import { app } from '../config'
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(app)

export default async function Login(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true; // Login successful
  } catch (error:any) {
    // Handle specific errors and provide user-friendly messages
    switch (error.code) {
      case 'auth/invalid-email':
        throw new Error('Invalid email format');
      case 'auth/wrong-password':
        throw new Error('Incorrect password');
      case 'auth/user-not-found':
        throw new Error('User not found. Please sign up.');
      // // ... handle other common errors
      // default:
      //   throw new Error('An error occurred. Please try again later.');
    }
  }
}
