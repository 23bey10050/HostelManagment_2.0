import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';

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
        case 'canteen':
          navigate('/dashboard/canteen');
          break;
        case 'cts':
          // Show CTS dashboard at root
          break;
      }
    }
  }, [user?.role, navigate, location.pathname]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-w)', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ flex: 1, padding: '28px 32px', paddingTop: 'calc(var(--header-h) + 28px)' }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}

export default DashboardLayout;
