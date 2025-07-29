import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;

  constructor() {
    const path = require('path');
    const fs = require('fs');
    
    // Try multiple possible paths
    const possiblePaths = [
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      path.join(process.cwd(), 'revobricks-firebase-adminsdk.json'),
      path.join(__dirname, '../../revobricks-firebase-adminsdk.json'),
      './revobricks-firebase-adminsdk.json'
    ].filter(Boolean);

    let serviceAccountPath = null;
    
    for (const pathToTry of possiblePaths) {
      if (fs.existsSync(pathToTry)) {
        serviceAccountPath = pathToTry;
        break;
      }
    }

    if (!serviceAccountPath) {
      console.error('Firebase service account file not found. Tried paths:', possiblePaths);
      console.log('Firebase features will be disabled');
      return;
    }

    try {
      console.log('Attempting to initialize Firebase with service account:', serviceAccountPath);
      const serviceAccount = require(serviceAccountPath);
      
      if (!serviceAccount.project_id) {
        throw new Error('Invalid service account file - missing project_id');
      }
      
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      console.log('Firebase Admin SDK initialized successfully');
      console.log('Project ID:', serviceAccount.project_id);
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error.message || error);
      console.log('Firebase features will be disabled');
    }
  }

  async createUser(
    email: string,
    password: string,
    displayName: string,
  ): Promise<string | null> {
    if (!this.app) {
      console.log('Firebase not initialized. Skipping user creation.');
      return null;
    }

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      return userRecord.uid;
    } catch (error) {
      console.error('Error creating Firebase user:', error);
      return null;
    }
  }

  async updateUser(uid: string, updates: any): Promise<void> {
    if (!this.app) {
      console.log('Firebase not initialized. Skipping user update.');
      return;
    }

    try {
      await admin.auth().updateUser(uid, updates);
    } catch (error) {
      console.error('Error updating Firebase user:', error);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    if (!this.app) {
      console.log('Firebase not initialized. Skipping user deletion.');
      return;
    }

    try {
      await admin.auth().deleteUser(uid);
    } catch (error) {
      console.error('Error deleting Firebase user:', error);
    }
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
    if (!this.app) {
      console.error('Firebase app not initialized');
      return null;
    }

    try {
      console.log('Verifying Firebase token...');
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Token verified successfully:', {
        uid: decodedToken.uid,
        email: decodedToken.email,
        phone_number: decodedToken.phone_number,
      });
      return decodedToken;
    } catch (error) {
      console.error('Error verifying Firebase token:', error.message || error);
      if (error.code) {
        console.error('Firebase error code:', error.code);
      }
      return null;
    }
  }
}
