import React from 'react'
import { app } from '../config'
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(app);
export default async function signup(email: string, password: string) {
    let userCredential, error;
  
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
    } catch (e) {
      error = e;
    }
  
    return { userCredential, error };
  }