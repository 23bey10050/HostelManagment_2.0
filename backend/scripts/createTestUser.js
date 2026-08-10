import firebaseAdmin from '../config/firebase.js';

const createTestUser = async () => {
  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email: 'worker@example.com',
      password: 'password123'
    });
    
    await firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'worker',
      workerCategory: 'Electrician'
    });

    console.log('Test user created:', userRecord.uid);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

createTestUser();
