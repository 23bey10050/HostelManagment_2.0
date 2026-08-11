import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';

const DEMOS = {
  student: { email: 'student@demo.com', password: 'demo123', label: 'Student',       accent: '#2563eb', icon: AcademicCapIcon },
  warden:  { email: 'warden@demo.com',  password: 'demo123', label: 'Warden',        accent: '#7c3aed', icon: ShieldCheckIcon },
  worker:  { email: 'worker@demo.com',  password: 'demo123', label: 'Worker',         accent: '#d97706', icon: WrenchScrewdriverIcon },
  canteen: { email: 'canteen@demo.com', password: 'demo123', label: 'Canteen Staff',  accent: '#059669', icon: BuildingStorefrontIcon },
  cts:     { email: 'admin@demo.com',   password: 'demo123', label: 'CTS Admin',      accent: '#db2777', icon: BriefcaseIcon },
};

// Tiny spinner using SVG (no Lucide)
function Spinner({ color = '#fff' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M12 3a9 9 0 019 9" strokeLinecap="round" />
    </svg>
  );
}

function LoginPage() {
  const { role }    = useParams();
  const navigate    = useNavigate();
  const { setUser } = useAuth();
  const demo        = DEMOS[role] || DEMOS.student;

  const [email,   setEmail]   = useState(demo.email);
  const [pass,    setPass]    = useState(demo.password);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = DEMOS[role];
    if (d) { setEmail(d.email); setPass(d.password); }
  }, [role]);

  const submit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await axios.post('/api/auth/staff/login', { email, password: pass });
      const { token, user: u } = res.data;
      setUser(u, token);
      const routes = { worker: '/dashboard/worker', warden: '/dashboard/warden', canteen: '/dashboard/canteen', student: '/dashboard/student', cts: '/dashboard' };
      navigate(routes[u.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = () => {
    const d = DEMOS[role] || DEMOS.student;
    setEmail(d.email); setPass(d.password);
    setTimeout(() => submit(null), 100);
  };

  const { accent, label, icon: RoleIcon } = demo;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* Back */}
      <Link
        to="/"
        style={{
          position: 'absolute', top: 18, left: 18,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px', borderRadius: 7,
          color: 'var(--color-text-soft)', textDecoration: 'none',
          fontSize: 13, fontWeight: 500,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-strong)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      >
        <ArrowLeftIcon style={{ width: 13, height: 13 }} />
        Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: 390 }}
      >
        {/* Card */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, overflow: 'hidden' }}>

          {/* Top accent stripe */}
          <div style={{ height: 3, background: accent }} />

          <div style={{ padding: '28px 28px 24px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 26 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 9,
                background: accent + '14',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <RoleIcon style={{ width: 20, height: 20, color: accent }} />
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px', margin: '0 0 3px' }}>
                  Sign in
                </h1>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
                  {label} portal
                </p>
              </div>
            </div>

            {/* Quick demo button */}
            <button
              onClick={quickLogin}
              disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 8,
                background: accent, color: '#fff',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 500,
                marginBottom: 18, opacity: loading ? 0.7 : 1,
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.09)'; }}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}
            >
              {loading ? <Spinner /> : null}
              {loading ? 'Signing in…' : <><span>Quick demo login</span><ArrowRightIcon style={{ width: 13, height: 13 }} /></>}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>OR ENTER MANUALLY</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            {/* Form */}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: 5 }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <EnvelopeIcon style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="input-field" style={{ paddingLeft: 34 }}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: 5 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <LockClosedIcon style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="password" value={pass} onChange={e => setPass(e.target.value)} required
                    className="input-field" style={{ paddingLeft: 34 }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, fontSize: 13, color: '#dc2626' }}>
                      <ExclamationCircleIcon style={{ width: 14, height: 14, flexShrink: 0 }} />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit" disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}
              >
                {loading ? <><Spinner /><span>Authenticating…</span></> : 'Sign in'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 22px', background: 'var(--color-bg-subtle)', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
              Demo password:&nbsp;
              <code style={{ background: 'var(--color-bg-muted)', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text)' }}>demo123</code>
            </p>
          </div>
        </div>

        {/* Other portals */}
        <div style={{ marginTop: 16, display: 'flex', gap: 7, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.entries(DEMOS).filter(([r]) => r !== role).map(([r, d]) => {
            const Icon = d.icon;
            return (
              <Link
                key={r}
                to={`/login/${r}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, color: 'var(--color-text-soft)',
                  padding: '5px 10px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6, textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-strong)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <Icon style={{ width: 11, height: 11, color: d.accent }} />
                {d.label}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
