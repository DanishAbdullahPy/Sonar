// lib/firebase-admin.js
import admin from "firebase-admin";

// Parse service account key if available
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
} catch (error) {
  serviceAccount = {};
}

// Ensure project_id is available
if (!serviceAccount.project_id && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  serviceAccount.project_id = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

if (!admin.apps.length) {
  // If we have a complete service account, use it
  if (serviceAccount.private_key && serviceAccount.client_email && serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // For development/build time, initialize with minimal config
    // This allows the build to complete but auth verification will fail at runtime
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
}

export { admin };
