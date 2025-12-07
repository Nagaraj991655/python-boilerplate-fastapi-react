import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI, handleAPIError } from '../services/api';
import type { Post } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postAPI.getPosts();
      setPosts(data);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>FastAPI + React</h1>
        <div style={styles.navRight}>
          <span style={styles.username}>Welcome, {user?.username}!</span>
          <button onClick={() => navigate('/profile')} style={styles.navButton}>
            Profile
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} style={styles.navButton}>
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h2>My Posts</h2>
          <button onClick={() => navigate('/posts/new')} style={styles.createButton}>
            Create Post
          </button>
        </div>

        {loading && <p>Loading posts...</p>}
        {error && <div style={styles.error}>{error}</div>}

        {!loading && posts.length === 0 && (
          <div style={styles.emptyState}>
            <p>No posts yet. Create your first post!</p>
          </div>
        )}

        <div style={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} style={styles.postCard}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postContent}>
                {post.content || 'No content'}
              </p>
              <p style={styles.postDate}>
                Created: {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div style={styles.postActions}>
                <button
                  onClick={() => navigate(`/posts/${post.id}/edit`)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete this post?')) {
                      await postAPI.deletePost(post.id);
                      fetchPosts();
                    }
                  }}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  nav: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    color: '#007bff',
  },
  navRight: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
  },
  navButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  createButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: '#dc3545',
    padding: '1rem',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: '#666',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  postCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  postTitle: {
    marginTop: 0,
    marginBottom: '0.5rem',
    color: '#333',
  },
  postContent: {
    color: '#666',
    marginBottom: '1rem',
  },
  postDate: {
    fontSize: '0.875rem',
    color: '#999',
    marginBottom: '1rem',
  },
  postActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Dashboard;
