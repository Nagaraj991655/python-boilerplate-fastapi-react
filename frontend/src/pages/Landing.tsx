import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>FastAPI Boilerplate</div>
        <div style={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <span style={styles.welcomeText}>Welcome, {user?.username}</span>
              <button onClick={() => navigate('/dashboard')} style={styles.navButton}>
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={styles.navButtonOutline}>
                Login
              </button>
              <button onClick={() => navigate('/register')} style={styles.navButton}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Build Modern Web Apps<br />
            <span style={styles.heroHighlight}>Faster Than Ever</span>
          </h1>
          <p style={styles.heroSubtitle}>
            A production-ready full-stack boilerplate with FastAPI, React, JWT authentication,
            role-based access control, and everything you need to launch your next project.
          </p>
          <div style={styles.heroButtons}>
            <button onClick={handleGetStarted} style={styles.primaryButton}>
              Get Started
            </button>
            <button onClick={() => navigate('/login')} style={styles.secondaryButton}>
              Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything You Need</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128640;</div>
            <h3 style={styles.featureTitle}>FastAPI Backend</h3>
            <p style={styles.featureText}>
              High-performance Python backend with automatic OpenAPI docs,
              async support, and type validation.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#9881;</div>
            <h3 style={styles.featureTitle}>React Frontend</h3>
            <p style={styles.featureText}>
              Modern React 18 with TypeScript, Vite for lightning-fast builds,
              and clean component architecture.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128274;</div>
            <h3 style={styles.featureTitle}>JWT Authentication</h3>
            <p style={styles.featureText}>
              Secure authentication with access & refresh tokens,
              bcrypt password hashing, and protected routes.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128101;</div>
            <h3 style={styles.featureTitle}>Role-Based Access</h3>
            <p style={styles.featureText}>
              Admin and user roles with granular permissions,
              protected routes, and admin dashboard.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128451;</div>
            <h3 style={styles.featureTitle}>MySQL Database</h3>
            <p style={styles.featureText}>
              SQLAlchemy ORM with Alembic migrations,
              connection pooling, and query optimization.
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>&#128736;</div>
            <h3 style={styles.featureTitle}>Production Ready</h3>
            <p style={styles.featureText}>
              Rate limiting, CORS configuration, environment variables,
              and best practices built-in.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section style={styles.demo}>
        <div style={styles.demoCard}>
          <h2 style={styles.demoTitle}>Try the Demo</h2>
          <p style={styles.demoText}>Login with these credentials to explore the dashboard:</p>
          <div style={styles.credentials}>
            <div style={styles.credentialItem}>
              <strong>Admin Login:</strong>
              <code style={styles.code}>admin@example.com / admin123</code>
            </div>
            <div style={styles.credentialItem}>
              <strong>Or register</strong> a new account to test user features
            </div>
          </div>
          <button onClick={() => navigate('/login')} style={styles.demoButton}>
            Go to Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>FastAPI + React Boilerplate &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: 'white',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 4rem',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  navLogo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#94a3b8',
    marginRight: '1rem',
  },
  navButton: {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  navButtonOutline: {
    padding: '0.625rem 1.25rem',
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  hero: {
    padding: '6rem 4rem',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
  },
  heroHighlight: {
    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#94a3b8',
    lineHeight: '1.8',
    marginBottom: '2.5rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '1rem 2.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  secondaryButton: {
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid #475569',
    borderRadius: '12px',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  features: {
    padding: '5rem 4rem',
    backgroundColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: '#0f172a',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #334155',
    transition: 'all 0.3s',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
  },
  featureText: {
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  demo: {
    padding: '5rem 4rem',
    backgroundColor: '#0f172a',
  },
  demoCard: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#1e293b',
    padding: '3rem',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #334155',
  },
  demoTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  demoText: {
    color: '#94a3b8',
    marginBottom: '2rem',
  },
  credentials: {
    textAlign: 'left',
    marginBottom: '2rem',
  },
  credentialItem: {
    padding: '1rem',
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  code: {
    display: 'block',
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#334155',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  demoButton: {
    padding: '1rem 3rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footer: {
    padding: '2rem',
    textAlign: 'center',
    color: '#64748b',
    borderTop: '1px solid #1e293b',
  },
};

export default Landing;
