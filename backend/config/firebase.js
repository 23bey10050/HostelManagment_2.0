import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const serviceAccount = JSON.parse(
    fs.readFileSync(join(__dirname, 'serviceAccount.json'), 'utf8')
  );

  // Check if Firebase app is already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: "hostelmanagement-d912d"
    });
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  process.exit(1);
}

export default admin;
