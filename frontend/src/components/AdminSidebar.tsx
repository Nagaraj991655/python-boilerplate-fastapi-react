import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', path: '/admin', icon: '&#128200;' },
  { label: 'Users', path: '/admin/users', icon: '&#128101;' },
  { label: 'Posts', path: '/admin/posts', icon: '&#128196;' },
  { label: 'Settings', path: '/admin/settings', icon: '&#9881;' },
];

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>&#9879;</span>
        <span style={styles.logoText}>Admin Panel</span>
      </div>

      {/* User Info */}
      <div style={styles.userInfo}>
        <div style={styles.avatar}>
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div style={styles.userDetails}>
          <span style={styles.userName}>{user?.username}</span>
          <span style={styles.userRole}>{user?.role}</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.menuItemActive : {}),
            }}
          >
            <span
              style={styles.menuIcon}
              dangerouslySetInnerHTML={{ __html: item.icon }}
            />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Secondary Actions */}
      <div style={styles.secondaryNav}>
        <button onClick={() => navigate('/dashboard')} style={styles.secondaryItem}>
          <span style={styles.menuIcon}>&#127968;</span>
          <span>User Dashboard</span>
        </button>
        <button onClick={() => navigate('/')} style={styles.secondaryItem}>
          <span style={styles.menuIcon}>&#127760;</span>
          <span>View Site</span>
        </button>
      </div>

      {/* Logout */}
      <div style={styles.logoutContainer}>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <span style={styles.menuIcon}>&#128682;</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: '260px',
    minHeight: '100vh',
    backgroundColor: '#1e293b',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.5rem',
    borderBottom: '1px solid #334155',
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.25rem 1.5rem',
    backgroundColor: '#0f172a',
    margin: '1rem',
    borderRadius: '12px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '1rem',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  nav: {
    padding: '0.5rem 1rem',
    flex: 1,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'all 0.2s',
    marginBottom: '0.25rem',
  },
  menuItemActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  menuIcon: {
    fontSize: '1.1rem',
    width: '24px',
    textAlign: 'center',
  },
  divider: {
    height: '1px',
    backgroundColor: '#334155',
    margin: '0.5rem 1.5rem',
  },
  secondaryNav: {
    padding: '0.5rem 1rem',
  },
  secondaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: '#64748b',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'all 0.2s',
    marginBottom: '0.25rem',
  },
  logoutContainer: {
    padding: '1rem',
    borderTop: '1px solid #334155',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.875rem 1rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
};

export default AdminSidebar;
