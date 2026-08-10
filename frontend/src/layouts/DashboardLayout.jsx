import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if at root dashboard path and user has role
    if (user?.role && location.pathname === '/dashboard') {
      switch (user.role) {
        case 'worker':
          navigate('/dashboard/worker');
          break;
        case 'warden':
          navigate('/dashboard/warden');
          break;
        case 'student':
          navigate('/dashboard/student');
          break;
        case 'cts':
          // Changed from '/dashboard/students' to '/' to show CTS dashboard
          break;
      }
    }
  }, [user?.role, navigate, location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
