import { useState, useEffect, useCallback } from 'react';
import LoginForm from './LoginForm';
import LinksTab from './LinksTab';
import UsersTab from './UsersTab';
import type { Link, User, CurrentUser } from '../types';
import { API_BASE_URL, FRONTEND_URL } from '../config';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<Link[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'links' | 'users'>('links');

  const authHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    [token]
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setLinks([]);
    setUsers([]);
    setCurrentUser(null);
  };

  const fetchCurrentUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  }, [token, authHeaders]);

  const fetchStats = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/links`, {
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching links:', err);
    }
  }, [token, authHeaders]);

  const fetchUsers = useCallback(async () => {
    if (!token || !currentUser?.is_admin) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [token, authHeaders, currentUser?.is_admin]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchStats();
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [token, fetchCurrentUser, fetchStats]);

  useEffect(() => {
    if (currentUser?.is_admin) {
      fetchUsers();
    }
  }, [currentUser?.is_admin, fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/links/create`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedLink(`${FRONTEND_URL}/${data.short_code}`);
        await fetchStats();
        setUrl('');
      } else if (response.status === 401) {
        handleLogout();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to create link');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error creating link:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const toggleUserActive = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      if (response.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const toggleUserAdmin = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ is_admin: !currentStatus }),
      });
      if (response.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (response.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const deleteLink = async (shortCode: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/links/${shortCode}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (response.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  if (!token) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  const copyToClipboard = async (shortCode: string) => {
    const fullUrl = `${FRONTEND_URL}/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const truncateUrl = (url: string, maxLength = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <header className="admin-header">
          <h1 className="admin-title">🔗 Trust Me Bro</h1>
          <div className="header-right">
            {currentUser && (
              <span className="user-badge">
                {currentUser.username}
                {currentUser.is_admin && <span className="admin-badge">Admin</span>}
              </span>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>
        <p className="admin-subtitle">
          Definitely not a link shortener for suspicious activities...
        </p>

        {/* Admin tabs */}
        {currentUser?.is_admin && (
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              🔗 Links
            </button>
            <button
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users ({users.length})
            </button>
          </div>
        )}

        {activeTab === 'links' && (
          <LinksTab
            links={links}
            url={url}
            setUrl={setUrl}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            generatedLink={generatedLink}
            copiedCode={copiedCode}
            copyToClipboard={copyToClipboard}
            deleteLink={deleteLink}
            formatDate={formatDate}
            truncateUrl={truncateUrl}
          />
        )}

        {activeTab === 'users' && currentUser?.is_admin && (
          <UsersTab
            users={users}
            currentUser={currentUser}
            toggleUserActive={toggleUserActive}
            toggleUserAdmin={toggleUserAdmin}
            deleteUser={deleteUser}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
