import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CTSLogin from './pages/CTSLogin';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import CTSDashboard from './pages/dashboard/CTSDashboard';
import StudentsPage from './pages/dashboard/StudentsPage';
import StaffManagementPage from './pages/dashboard/StaffManagementPage';
import ComplaintsPage from './pages/dashboard/ComplaintsPage';
import WorkerDashboard from './pages/dashboard/WorkerDashboard';
import WardenDashboard from './pages/dashboard/WardenDashboard';
import AnnouncementsPage from './pages/dashboard/AnnouncementsPage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CreateComplaint from './pages/dashboard/CreateComplaint';
import StudentAnnouncements from './pages/dashboard/StudentAnnouncements';
import MessFeedbackPage from './pages/dashboard/MessFeedbackPage';
import CanteenDashboard from './pages/dashboard/CanteenDashboard';
import CanteenMenu from './pages/dashboard/CanteenMenu';
import CanteenOrders from './pages/dashboard/CanteenOrders';
import StudentCanteen from './pages/dashboard/StudentCanteen'; // New component to be created

function App() {
  return (
    <AuthProvider>
      <AnnouncementProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/admin" element={<CTSLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<CTSDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="staff" element={<StaffManagementPage />} />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route path="worker" element={<WorkerDashboard />} />
              <Route path="warden" element={<WardenDashboard />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="student" element={<StudentDashboard />} />
              <Route path="submit-complaint" element={<CreateComplaint />} />
              <Route path="student-announcements" element={<StudentAnnouncements />} />
              <Route path="mess-feedback" element={<MessFeedbackPage />} />
              
              {/* Night Canteen Routes */}
              <Route path="canteen" element={<CanteenDashboard />} />
              <Route path="canteen-menu" element={<CanteenMenu />} />
              <Route path="canteen-orders" element={<CanteenOrders />} />
              <Route path="student-canteen" element={<StudentCanteen />} />
            </Route>
          </Routes>
        </Router>
      </AnnouncementProvider>
    </AuthProvider>
  );
}

export default App;
