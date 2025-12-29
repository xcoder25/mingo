import * as admin from 'firebase-admin';

const getServiceAccount = () => {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    try {
        return JSON.parse(serviceAccountString);
    } catch (e) {
        throw new Error('Could not parse FIREBASE_SERVICE_ACCOUNT_KEY. Is it valid JSON?');
    }
};

export function initializeAdmin() {
  if (admin.apps.length > 0) {
    return {
      admin,
      firestore: admin.firestore(),
    };
  }

  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  return {
    admin,
    firestore: admin.firestore(),
  };
}
