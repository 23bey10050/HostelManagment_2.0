import { useAuth } from '../context/AuthContext';
import {
  AcademicCapIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/solid';

const ROLE_LABEL = {
  student: 'Student',
  warden:  'Warden',
  worker:  'Worker',
  canteen: 'Canteen Staff',
  cts:     'CTS Admin',
};

const ROLE_ICON = {
  student: AcademicCapIcon,
  warden:  ShieldCheckIcon,
  worker:  WrenchScrewdriverIcon,
  canteen: BuildingStorefrontIcon,
  cts:     Cog8ToothIcon,
};

function Header() {
  const { user } = useAuth();
  const label    = ROLE_LABEL[user?.role] || '';
  const RoleIcon = ROLE_ICON[user?.role]  || Cog8ToothIcon;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-w)',
      right: 0,
      height: 'var(--header-h)',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 30,
    }}>

      {/* Left: context label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RoleIcon style={{ width: 16, height: 16, color: '#2563eb' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.1px' }}>
          {label} Dashboard
        </span>
      </div>

      {/* Right: user chip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 12px',
        background: 'var(--color-bg-subtle)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
      }}>
        {/* Avatar circle */}
        <div style={{
          width: 24, height: 24,
          background: '#2563eb',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>
          {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: 13, color: 'var(--color-text-soft)', fontWeight: 500 }}>
          {user?.name || user?.email?.split('@')[0] || 'User'}
        </span>
      </div>
    </header>
  );
}

export default Header;
