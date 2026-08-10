import { initializeApp } from 'firebase/app';  // Changed from 'firebase/auth'
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import dotenv from 'dotenv';

dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWD4QhF7sk9-DRVNrf5ApRy0aet_Z30SI",
    authDomain: "hostelmanagement-d912d.firebaseapp.com",
    projectId: "hostelmanagement-d912d",
    storageBucket: "hostelmanagement-d912d.firebasestorage.app",
    messagingSenderId: "224663957279",
    appId: "1:224663957279:web:236fdf0891b523932eca2a",
    measurementId: "G-Q8T1RFCQBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const customToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTc0MjkxOTUyNCwiZXhwIjoxNzQyOTIzMTI0LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0Bob3N0ZWxtYW5hZ2VtZW50LWQ5MTJkLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmJzdmNAaG9zdGVsbWFuYWdlbWVudC1kOTEyZC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Im1mbDJ4TGNDRkhReTBvdnIxMkoxSjRUcWhJSzIiLCJjbGFpbXMiOnsicm9sZSI6IndhcmRlbiJ9fQ.O8tJ0pRfPa0SUuKwQk1DKfV6tE182TiffqQyI2ptu8AUVPVYYGpcWeD5YnYk18GiMLing5-0sM7gVlXjyBk4yFdLczLhdoSH1hIGGQHraXhaZT0mItDNurC6Lbq0gujjdyeZSeVHfJOcsO_OLcnp2ajGgQqpWswH9smm_aH6WS8SWFyvp_jfuFVRssRBW00MvCqid_t9uN4a0KKd-WKJDBTxJI43rtnSVyJMRKPveWReKRRd52bu_OTiYdMxO7F9n-luaBdMwL8PTuesogdJGRqql-9R60YV8R1q3xULU3ZBL2n-jPc3rAusqj5wydMPsQJZc5L7NDb5WD3rEn1-IQ"; // Replace with the token you got from CTS login

async function getIdToken() {
  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    const idToken = await userCredential.user.getIdToken();
    console.log("ID Token:", idToken);
    return idToken;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

getIdToken().catch(console.error);
