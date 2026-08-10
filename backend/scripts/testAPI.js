import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';

dotenv.config();

const API_URL = 'http://localhost:8000/api';
let ctsToken, studentToken, wardenToken, workerToken;

const test = async () => {
  try {
    // 1. Test CTS Login
    console.log('\nTesting CTS Login...');
    const ctsLogin = await axios.post(`${API_URL}/auth/cts/login`, {
      email: process.env.CTS_EMAIL,
      password: process.env.CTS_PASSWORD
    });
    ctsToken = ctsLogin.data.customToken;
    console.log('CTS Login successful');

    // 2. Test Student Management
    console.log('\nTesting Student Management...');
    const students = await axios.get(`${API_URL}/students`, {
      headers: { Authorization: `Bearer ${ctsToken}` }
    });
    console.log('Students found:', students.data.length);

    // 3. Test Complaints
    console.log('\nTesting Complaints...');
    const complaints = await axios.get(`${API_URL}/complaints`, {
      headers: { Authorization: `Bearer ${workerToken || ctsToken}` }
    });
    console.log('Complaints found:', complaints.data.length);

    // 4. Test Announcements
    console.log('\nTesting Announcements...');
    const announcements = await axios.get(`${API_URL}/announcements`, {
      headers: { Authorization: `Bearer ${ctsToken}` }
    });
    console.log('Announcements found:', announcements.data.length);

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

test();
