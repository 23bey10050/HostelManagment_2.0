import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  BriefcaseIcon,
  CheckIcon,
  MoonIcon,
  SunIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
});

const PORTALS = [
  {
    role: 'student',
    title: 'Student',
    desc: 'Submit complaints, view announcements, order from the night canteen.',
    icon: AcademicCapIcon,
    href: '/login/student',
    accent: '#2563eb',
    lightBg: '#eff6ff',
    darkBg: 'rgba(37,99,235,0.12)',
    features: ['Complaint tracking', 'Night canteen orders', 'Live announcements'],
  },
  {
    role: 'warden',
    title: 'Warden',
    desc: 'Manage hostel operations, resolve complaints and publish announcements.',
    icon: ShieldCheckIcon,
    href: '/login/warden',
    accent: '#7c3aed',
    lightBg: '#f5f3ff',
    darkBg: 'rgba(124,58,237,0.12)',
    features: ['Student overview', 'Complaint management', 'Mess feedback review'],
  },
  {
    role: 'worker',
    title: 'Worker',
    desc: 'View and resolve assigned maintenance tasks efficiently.',
    icon: WrenchScrewdriverIcon,
    href: '/login/worker',
    accent: '#d97706',
    lightBg: '#fffbeb',
    darkBg: 'rgba(217,119,6,0.12)',
    features: ['Task queue by category', 'Status updates', 'Priority handling'],
  },
  {
    role: 'canteen',
    title: 'Canteen Staff',
    desc: 'Manage the night canteen menu and process student orders.',
    icon: BuildingStorefrontIcon,
    href: '/login/canteen',
    accent: '#059669',
    lightBg: '#ecfdf5',
    darkBg: 'rgba(5,150,105,0.12)',
    features: ['Menu management', 'Live order queue', 'UPI payments'],
  },
];

function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 54,
        background: isDark ? 'rgba(10,10,11,0.9)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 26, height: 26, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 20 20" fill="white" width="13" height="13">
              <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v12h2a1 1 0 010 2H2a1 1 0 010-2h2V4zm2 0v12h8V4H4zm2 3a1 1 0 011-1h2a1 1 0 010 2H7a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 010 2H7a1 1 0 01-1-1z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.3px', color: 'var(--color-text)' }}>HostelMS</span>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px',
              background: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 7, cursor: 'pointer',
              fontSize: 12, color: 'var(--color-text-soft)',
            }}
          >
            {isDark ? <SunIcon style={{ width: 13, height: 13 }} /> : <MoonIcon style={{ width: 13, height: 13 }} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
          <Link
            to="/login/cts"
            style={{
              padding: '6px 14px',
              background: '#db2777',
              border: '1px solid #be185d',
              borderRadius: 7, fontSize: 13,
              color: 'white', textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            CTS Admin Portal
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 110, paddingBottom: 64, textAlign: 'center', maxWidth: 640, margin: '0 auto', padding: '110px 24px 64px' }}>
        <motion.div {...fadeUp(0)}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '4px 12px',
            background: isDark ? 'rgba(37,99,235,0.12)' : '#eff6ff',
            border: `1px solid ${isDark ? 'rgba(37,99,235,0.25)' : '#bfdbfe'}`,
            borderRadius: 99,
            color: '#2563eb', fontSize: 12, fontWeight: 600,
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, background: '#2563eb', borderRadius: '50%' }} />
            System active · Demo credentials ready
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(0.06)} style={{
          fontSize: 'clamp(34px, 5.5vw, 56px)',
          fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1,
          color: 'var(--color-text)', margin: '0 0 18px',
        }}>
          Hostel Management<br />
          <span style={{ color: '#2563eb' }}>Reimagined</span>
        </motion.h1>

        <motion.p {...fadeUp(0.12)} style={{
          fontSize: 16, color: 'var(--color-text-soft)',
          maxWidth: 460, margin: '0 auto 0',
          lineHeight: 1.65, fontWeight: 400,
        }}>
          One platform for students, wardens, workers, and canteen staff. Built for real hostel operations.
        </motion.p>
      </section>

      {/* ── Portal cards ── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 14,
        }}>
          {PORTALS.map((portal, i) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.role}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.18 + i * 0.07 }}
              >
                <Link to={portal.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 12,
                      padding: '22px 22px 18px',
                      cursor: 'pointer',
                      transition: 'border-color 0.18s, box-shadow 0.18s, transform 0.18s',
                      height: '100%',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = portal.accent;
                      e.currentTarget.style.boxShadow = `0 6px 24px ${portal.accent}20`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 40, height: 40,
                      background: isDark ? portal.darkBg : portal.lightBg,
                      borderRadius: 9,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 14,
                    }}>
                      <Icon style={{ width: 20, height: 20, color: portal.accent }} />
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 5, letterSpacing: '-0.2px' }}>
                      {portal.title} Portal
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-soft)', lineHeight: 1.5, marginBottom: 16 }}>
                      {portal.desc}
                    </div>

                    {/* Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                      {portal.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--color-text-soft)' }}>
                          <CheckIcon style={{ width: 12, height: 12, color: portal.accent, flexShrink: 0 }} />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: portal.accent }}>
                      Sign in <ChevronRightIcon style={{ width: 13, height: 13 }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Demo banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{
            marginTop: 28,
            padding: '13px 18px',
            background: isDark ? 'rgba(37,99,235,0.07)' : '#f0f6ff',
            border: `1px solid ${isDark ? 'rgba(37,99,235,0.18)' : '#c7d9f8'}`,
            borderRadius: 9,
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <div style={{ paddingTop: 1 }}>
            <ShieldCheckIcon style={{ width: 16, height: 16, color: '#2563eb' }} />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>Demo accounts are ready. </span>
            <span style={{ fontSize: 13, color: 'var(--color-text-soft)' }}>
              All use password&nbsp;
              <code style={{ padding: '1px 5px', borderRadius: 4, background: 'var(--color-bg-muted)', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text)' }}>demo123</code>
              &nbsp;—&nbsp;admin@demo.com · student@demo.com · warden@demo.com · worker@demo.com · canteen@demo.com
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '32px 24px', maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
        {[
          { val: '4 Roles',  desc: 'Student · Warden · Worker · Canteen' },
          { val: 'MongoDB',  desc: 'Live database with seeded demo data' },
          { val: 'JWT Auth', desc: 'Secure, stateless authentication' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '0 20px', borderRight: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
            <div style={{ fontSize: 20, fontWeight: 750, letterSpacing: '-0.4px', color: 'var(--color-text)', marginBottom: 3 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
