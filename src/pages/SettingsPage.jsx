import { NavLink, useNavigate } from 'react-router';
import { getUser } from '../utils';

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = getUser();
  const isOrganiser = user?.role === 'Organiser';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          {isOrganiser && (
            <NavLink to="/manage-events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              Manage Events
            </NavLink>
          )}
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Profile
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="settings-content">
          <h2 className="section-title">Settings</h2>

          <div className="settings-section">
            <h3 className="settings-section-title">Account</h3>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <span className="settings-item-label">Log out</span>
                <span className="settings-item-description">Sign out of your account</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
