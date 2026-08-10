import axios from 'axios';

// Initial Dummy Data to seed LocalStorage if it's empty
const initialData = {
  users: [
    { id: '1', email: 'warden@demo.com', role: 'warden', name: 'Demo Warden', uid: 'demo-warden' },
    { id: '2', email: 'student@demo.com', role: 'student', name: 'Demo Student', uid: 'demo-student' },
    { id: '3', email: 'worker@demo.com', role: 'worker', name: 'Demo Worker', workerCategory: 'plumber', uid: 'demo-worker' },
    { id: '4', email: 'canteen@demo.com', role: 'canteen', name: 'Demo Canteen Staff', uid: 'demo-canteen' }
  ],
  announcements: [
    { _id: 'a1', title: 'Welcome to Demo Mode', content: 'This app is running entirely in your browser using local storage.', date: new Date().toISOString(), author: { name: 'Demo Warden' } }
  ],
  complaints: [
    { _id: 'c1', title: 'Leaky Faucet', description: 'The tap in room 101 is leaking', category: 'plumbing', status: 'pending', createdAt: new Date().toISOString(), studentId: { name: 'Demo Student', roomNumber: '101' }, assignedWorker: null }
  ],
  students: [
    { _id: 'demo-student', name: 'Demo Student', email: 'student@demo.com', roomNumber: '101', rollNo: 'CS123' }
  ],
  canteenMenu: [],
  canteenOrders: []
};

// Seed LocalStorage
const seedDB = () => {
  if (!localStorage.getItem('demoDB_users')) {
    Object.keys(initialData).forEach(key => {
      localStorage.setItem(`demoDB_${key}`, JSON.stringify(initialData[key]));
    });
  }
};

const getDB = (table) => JSON.parse(localStorage.getItem(`demoDB_${table}`) || '[]');
const setDB = (table, data) => localStorage.setItem(`demoDB_${table}`, JSON.stringify(data));

// Setup Mock Adapter
export const setupMockBackend = () => {
  seedDB();

  // Create a custom adapter to intercept requests
  axios.defaults.adapter = async (config) => {
    const { url, method, data } = config;
    const parsedUrl = url.replace('http://localhost:8000', '');

    console.log(`[Mock Backend] Intercepted ${method.toUpperCase()} ${parsedUrl}`);

    const response = (status, data) => ({
      data,
      status,
      statusText: 'OK',
      headers: {},
      config,
      request: {}
    });

    try {
      // 1. AUTHENTICATION (Login bypass)
      if (parsedUrl.includes('/api/auth/') && method === 'post') {
        const body = JSON.parse(data);
        const users = getDB('users');
        // Accept any demo login based on email
        const user = users.find(u => u.email === body.email) || users[0];
        
        return response(200, {
          customToken: `mock-token-${user.role}`,
          user: user
        });
      }

      // 2. DASHBOARD STATS
      if (parsedUrl === '/api/stats/dashboard' && method === 'get') {
        return response(200, {
          totalStudents: getDB('students').length,
          totalComplaints: getDB('complaints').length,
          pendingComplaints: getDB('complaints').filter(c => c.status === 'pending').length
        });
      }

      // 3. ANNOUNCEMENTS
      if (parsedUrl === '/api/announcements' && method === 'get') {
        return response(200, { announcements: getDB('announcements') });
      }

      // 4. COMPLAINTS
      if (parsedUrl === '/api/complaints' && method === 'get') {
        return response(200, { complaints: getDB('complaints') });
      }
      
      if (parsedUrl === '/api/complaints/worker' && method === 'get') {
        return response(200, { complaints: getDB('complaints') });
      }

      // 5. STUDENTS
      if (parsedUrl === '/api/students' && method === 'get') {
        return response(200, { students: getDB('students') });
      }
      
      if (parsedUrl === '/api/students/me' && method === 'get') {
        const students = getDB('students');
        return response(200, students[0]);
      }

      // DEFAULT CATCH-ALL
      console.warn(`[Mock Backend] Unhandled route: ${method.toUpperCase()} ${parsedUrl}`);
      return response(200, {});

    } catch (err) {
      console.error('[Mock Backend] Error:', err);
      return response(500, { message: 'Mock server error' });
    }
  };
  
  console.log('[Mock Backend] initialized. All requests are routed to LocalStorage.');
};
