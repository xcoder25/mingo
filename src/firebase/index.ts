'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function getFirebaseConfig() {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error("Firebase config environment variables are not set!");
        return null;
    }
    return firebaseConfig;
}


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }

  const firebaseConfig = getFirebaseConfig();

  if (!firebaseConfig) {
      // If config is still missing, we return a structure that indicates failure,
      // but without throwing an error, allowing the app to handle it gracefully.
      // The useFirebase hook will throw an error if services are not available.
      // This prevents the entire app from crashing on render.
      return {
        firebaseApp: null,
        auth: null,
        firestore: null,
      } as any; // Cast to any to satisfy the return type for the provider
  }

  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';