import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, handleAPIError } from '../services/api';
import AdminSidebar from '../components/AdminSidebar';
import type { DashboardStats, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      fetchData();
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      if (isActive) {
        await adminAPI.deactivateUser(userId);
      } else {
        await adminAPI.activateUser(userId);
      }
      fetchData();
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await adminAPI.deleteUser(userId);
      fetchData();
    } catch (err) {
      alert(handleAPIError(err));
    }
  };

  if (loading) {
    return (
      <div style={styles.layout}>
        <AdminSidebar />
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.layout}>
      <AdminSidebar />
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Dashboard Overview</h1>
            <p style={styles.subtitle}>Welcome back, {user?.username}</p>
          </div>
          <span style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </header>

        <div style={styles.content}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>&#128101;</div>
              <div style={styles.statInfo}>
                <span style={styles.statNumber}>{stats?.total_users || 0}</span>
                <span style={styles.statLabel}>Total Users</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#10b981'}}>&#9989;</div>
              <div style={styles.statInfo}>
                <span style={styles.statNumber}>{stats?.active_users || 0}</span>
                <span style={styles.statLabel}>Active Users</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#8b5cf6'}}>&#128081;</div>
              <div style={styles.statInfo}>
                <span style={styles.statNumber}>{stats?.admin_users || 0}</span>
                <span style={styles.statLabel}>Admin Users</span>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, backgroundColor: '#f59e0b'}}>&#128196;</div>
              <div style={styles.statInfo}>
                <span style={styles.statNumber}>{stats?.total_posts || 0}</span>
                <span style={styles.statLabel}>Total Posts</span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>User Management</h2>
              <span style={styles.sectionSubtitle}>{users.length} users registered</span>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>{u.id}</td>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.userAvatar}>
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          {u.username}
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as 'user' | 'admin')}
                          style={styles.select}
                          disabled={u.id === user?.id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td style={styles.td}>
                        <span style={u.is_active ? styles.badgeActive : styles.badgeInactive}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            onClick={() => handleToggleActive(u.id, u.is_active)}
                            style={u.is_active ? styles.deactivateButton : styles.activateButton}
                            disabled={u.id === user?.id}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            style={styles.deleteButton}
                            disabled={u.id === user?.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
  },
  main: {
    flex: 1,
    marginLeft: '260px',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'white',
    margin: 0,
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: '0.25rem',
  },
  date: {
    color: '#64748b',
    fontSize: '0.875rem',
  },
  content: {
    maxWidth: '1400px',
  },
  loading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem',
    color: 'white',
    marginLeft: '260px',
  },
  error: {
    color: '#fca5a5',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid #334155',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #334155',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'white',
    margin: 0,
  },
  sectionSubtitle: {
    color: '#64748b',
    fontSize: '0.875rem',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.875rem 1.5rem',
    color: '#94a3b8',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#0f172a',
  },
  tr: {
    borderBottom: '1px solid #334155',
  },
  td: {
    padding: '1rem 1.5rem',
    color: '#e2e8f0',
    fontSize: '0.9rem',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    color: 'white',
  },
  select: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  badgeActive: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#34d399',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  badgeInactive: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  activateButton: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  deactivateButton: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  deleteButton: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
};

export default AdminDashboard;
