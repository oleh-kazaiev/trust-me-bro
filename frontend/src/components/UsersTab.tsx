import React from 'react';
import type { User, CurrentUser } from '../types';

interface UsersTabProps {
  users: User[];
  currentUser: CurrentUser | null;
  toggleUserActive: (userId: number, currentStatus: boolean) => void;
  toggleUserAdmin: (userId: number, currentStatus: boolean) => void;
  deleteUser: (userId: number) => void;
  formatDate: (dateString: string) => string;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  currentUser,
  toggleUserActive,
  toggleUserAdmin,
  deleteUser,
  formatDate,
}) => {
  return (
    <div className="card">
      <h2>👥 User Management</h2>

      {users.length === 0 ? (
        <p className="empty-state">No users found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-container desktop-only">
            <table className="stats-table users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <span className={`role-badge ${user.is_admin ? 'admin' : 'user'}`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="date">{formatDate(user.created_at)}</td>
                    <td className="user-actions">
                      <button
                        onClick={() => toggleUserActive(user.id, user.is_active)}
                        className={`action-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                        disabled={user.id === currentUser?.id}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => toggleUserAdmin(user.id, user.is_admin)}
                        className="action-btn toggle-admin"
                        disabled={user.id === currentUser?.id}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="action-btn delete"
                        disabled={user.id === currentUser?.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards mobile-only">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <span className="user-name">{user.username}</span>
                  <div className="user-badges">
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {user.is_admin && <span className="role-badge admin">Admin</span>}
                  </div>
                </div>
                <div className="user-card-date">Joined: {formatDate(user.created_at)}</div>
                {user.id !== currentUser?.id && (
                  <div className="user-card-actions">
                    <button
                      onClick={() => toggleUserActive(user.id, user.is_active)}
                      className={`action-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => toggleUserAdmin(user.id, user.is_admin)}
                      className="action-btn toggle-admin"
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="action-btn delete">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UsersTab;
