import { initializeApp, getApps, cert } from 'firebase-admin/app';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';

const keyPath = process.env.FIREBASE_KEY_PATH || './kindercare-adminsdk-test.json';

let firebaseApp = null;

try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    logger.info('[Firebase] Already initialized, reusing existing app');
  } else {
    const resolvedPath = path.resolve(keyPath);
    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
      });
      logger.info(`[Firebase] Initialized successfully using credentials from ${keyPath}`);
    } else {
      logger.error(`[Firebase] [CRITICAL] Credentials file not found at ${resolvedPath}`);
    }
  }
} catch (error) {
  logger.error(`[Firebase] [CRITICAL] Failed to initialize Firebase Admin SDK: ${error.message}`);
}

export default firebaseApp;
