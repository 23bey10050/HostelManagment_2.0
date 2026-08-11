import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnnouncements } from '../context/AnnouncementContext';
import { useTheme } from '../context/ThemeContext';
import {
  HomeIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
  MegaphoneIcon,
  ChatBubbleLeftEllipsisIcon,
  PlusCircleIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  Cog8ToothIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';

const ROLE_LABELS = {
  student: 'Student',
  warden:  'Warden',
  worker:  'Worker',
  canteen: 'Canteen',
  cts:     'CTS Admin',
};

const NAV_BY_ROLE = {
  student: [
    { label: 'Dashboard',        href: '/dashboard/student',               icon: HomeIcon },
    { label: 'Announcements',    href: '/dashboard/student-announcements', icon: MegaphoneIcon,              badge: true },
    { label: 'My Complaints',    href: '/dashboard/complaints',            icon: ChatBubbleLeftEllipsisIcon },
    { label: 'Submit Complaint', href: '/dashboard/submit-complaint',      icon: PlusCircleIcon },
    { label: 'Night Canteen',    href: '/dashboard/student-canteen',       icon: BuildingStorefrontIcon },
  ],
  warden: [
    { label: 'Dashboard',     href: '/dashboard/warden',        icon: HomeIcon },
    { label: 'Students',      href: '/dashboard/students',      icon: UsersIcon },
    { label: 'Complaints',    href: '/dashboard/complaints',    icon: ChatBubbleLeftEllipsisIcon },
    { label: 'Announcements', href: '/dashboard/announcements', icon: MegaphoneIcon },
    { label: 'Mess Feedback', href: '/dashboard/mess-feedback', icon: ClipboardDocumentListIcon },
  ],
  worker: [
    { label: 'My Tasks', href: '/dashboard/worker', icon: WrenchScrewdriverIcon },
  ],
  canteen: [
    { label: 'Dashboard',       href: '/dashboard/canteen',        icon: HomeIcon },
    { label: 'Menu Management', href: '/dashboard/canteen-menu',   icon: ClipboardDocumentListIcon },
    { label: 'Orders',          href: '/dashboard/canteen-orders', icon: ShoppingCartIcon },
  ],
  cts: [
    { label: 'Dashboard',     href: '/dashboard',               icon: HomeIcon },
    { label: 'Students',      href: '/dashboard/students',      icon: UsersIcon },
    { label: 'Staff',         href: '/dashboard/staff',         icon: Cog8ToothIcon },
    { label: 'Complaints',    href: '/dashboard/complaints',    icon: ChatBubbleLeftEllipsisIcon },
    { label: 'Mess Feedback', href: '/dashboard/mess-feedback', icon: ClipboardDocumentListIcon },
  ],
};

const ROLE_ICON_COMPONENT = {
  student: AcademicCapIcon,
  warden:  ShieldCheckIcon,
  worker:  WrenchScrewdriverIcon,
  canteen: BuildingStorefrontIcon,
  cts:     Cog8ToothIcon,
};

function Sidebar() {
  const { user, setUser }      = useAuth();
  const { unreadCount }        = useAnnouncements();
  const { theme, toggleTheme } = useTheme();
  const location               = useLocation();

  const items    = NAV_BY_ROLE[user?.role] || [];
  const roleName = ROLE_LABELS[user?.role] || 'User';
  const RoleIcon = ROLE_ICON_COMPONENT[user?.role] || Cog8ToothIcon;
  const isDark   = theme === 'dark';

  const handleLogout = () => {
    setUser(null, null);
    window.location.href = '/';
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0,
      width: 'var(--sidebar-w)',
      height: '100vh',
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 40,
      overflow: 'hidden',
    }}>

      {/* ── Brand ── */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30,
          background: '#2563eb',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {/* Custom building icon — no AI gradient */}
          <svg viewBox="0 0 20 20" fill="white" width="16" height="16">
            <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v12h2a1 1 0 010 2H2a1 1 0 010-2h2V4zm2 0v12h8V4H4zm2 3a1 1 0 011-1h2a1 1 0 010 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 010 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 010 2H7a1 1 0 01-1-1z" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.2px' }}>HostelMS</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Management Portal</div>
        </div>
      </div>

      {/* ── User chip ── */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '8px 10px',
          background: 'var(--color-bg-subtle)',
          borderRadius: 8,
        }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--color-bg-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <RoleIcon style={{ width: 14, height: 14, color: '#2563eb' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{roleName}</div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', padding: '4px 6px 6px' }}>
          Navigation
        </div>

        {items.map(({ label, href, icon: Icon, badge }) => {
          const isActive = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
          const count    = badge ? unreadCount : 0;
          return (
            <Link
              key={href}
              to={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '7px 10px',
                borderRadius: 7,
                marginBottom: 1,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: isActive ? 600 : 450,
                color: isActive ? '#2563eb' : 'var(--color-text-soft)',
                background: isActive ? (isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff') : 'transparent',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--color-bg-muted)'; e.currentTarget.style.color = 'var(--color-text)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-soft)'; } }}
            >
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {count > 0 && (
                <span style={{
                  background: '#dc2626', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 99,
                  lineHeight: 1.6,
                }}>
                  {count}
                </span>
              )}
              {isActive && <ChevronRightIcon style={{ width: 12, height: 12, opacity: 0.5 }} />}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer controls ── */}
      <div style={{ padding: '10px 10px', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={toggleTheme}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '7px 10px', borderRadius: 7, marginBottom: 1,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--color-text-soft)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-muted)'; e.currentTarget.style.color = 'var(--color-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text-soft)'; }}
        >
          {isDark
            ? <SunIcon style={{ width: 15, height: 15 }} />
            : <MoonIcon style={{ width: 15, height: 15 }} />
          }
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '7px 10px', borderRadius: 7,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#dc2626',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <ArrowRightOnRectangleIcon style={{ width: 15, height: 15 }} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
