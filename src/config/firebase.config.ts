import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  private app: admin.app.App | null;

  constructor() {
    this.app = null; // Initialize to null
    const path = require('path');
    const fs = require('fs');
    
    console.log('🔍 Firebase Service initialization');
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('FIREBASE_SERVICE_ACCOUNT_PATH:', process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'NOT SET');
    
    // Try multiple possible paths - absolute paths first for reliability
    const possiblePaths = [
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
      path.resolve(process.cwd(), 'config/revobricks-firebase-adminsdk.json'), // Absolute path from project root
      path.join(process.cwd(), 'config/revobricks-firebase-adminsdk.json'),
      path.join(__dirname, '../../../config/revobricks-firebase-adminsdk.json'), // From dist/config back to root/config
      path.join(__dirname, '../../config/revobricks-firebase-adminsdk.json'),
      './config/revobricks-firebase-adminsdk.json'
    ].filter(Boolean);

    let serviceAccountPath = null;
    
    console.log('Trying Firebase config paths:');
    for (const pathToTry of possiblePaths) {
      const exists = fs.existsSync(pathToTry);
      const resolved = path.resolve(pathToTry);
      console.log(`  - ${pathToTry} (${resolved}) -> ${exists ? '✅' : '❌'}`);
      
      if (exists && !serviceAccountPath) {
        serviceAccountPath = pathToTry;
      }
    }

    if (!serviceAccountPath) {
      console.error('❌ Firebase service account file not found');
      console.log('Firebase features will be disabled');
      return;
    }

    try {
      console.log('Attempting to initialize Firebase with service account:', serviceAccountPath);
      
      // Use absolute path for require() to avoid module resolution issues
      const absolutePath = path.isAbsolute(serviceAccountPath) 
        ? serviceAccountPath 
        : path.resolve(serviceAccountPath);
      
      console.log('Resolved absolute path:', absolutePath);
      const serviceAccount = require(absolutePath);
      
      if (!serviceAccount.project_id) {
        throw new Error('Invalid service account file - missing project_id');
      }
      
      // Check if Firebase Admin is already initialized
      if (admin.apps.length > 0) {
        console.log('Firebase Admin already initialized, using existing instance');
        this.app = admin.app();
      } else {
        this.app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id
        });
        console.log('Firebase Admin SDK initialized successfully');
      }
      console.log('Project ID:', serviceAccount.project_id);
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error.message || error);
      console.log('Firebase features will be disabled');
      this.app = null;
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
