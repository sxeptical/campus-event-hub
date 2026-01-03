import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    studentId: '',
    school: '',
    year: '',
    phone: '',
    bio: ''
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get logged-in user from localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userString);
        
        // If user has an ID, fetch latest data from server
        if (user.id) {
          const response = await fetch(`http://localhost:5050/users/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
            setEditedProfile(data);
            // Update localStorage with latest data
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            // Fallback to localStorage data
            setProfile(user);
            setEditedProfile(user);
          }
        } else {
          // No ID, use localStorage data
          setProfile(user);
          setEditedProfile(user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // On error, try to use localStorage data
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setProfile(user);
          setEditedProfile(user);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5050/users/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });
      const data = await response.json();
      setProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="dashboard-layout"><p>Loading profile...</p></div>;
  }

return (
    <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                </NavLink>
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
            <div className="profile-content">
                <div className="profile-header">
                    <h2 className="section-title">My Profile</h2>
                    {!isEditing && (
                        <button className="edit-profile-btn" onClick={handleEdit}>
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="profile-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            <span className="avatar-initials">
                                {profile.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        {isEditing && (
                            <button className="change-photo-btn">Change Photo</button>
                        )}
                    </div>

                    <div className="profile-details">
                        {isEditing ? (
                            <form className="profile-form">
                                <div className="profile-form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedProfile.name}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editedProfile.email}
                                        onChange={handleChange}
                                        className="profile-input"
                                        disabled
                                    />
                                </div>

                                <div className="profile-form-row">
                                    <div className="profile-form-group">
                                        <label>Student ID</label>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={editedProfile.studentId}
                                            onChange={handleChange}
                                            className="profile-input"
                                            disabled
                                        />
                                    </div>

                                    <div className="profile-form-group">
                                        <label>Year of Study</label>
                                        <select
                                            name="year"
                                            value={editedProfile.year}
                                            onChange={handleChange}
                                            className="profile-select"
                                        >
                                            <option value="1">Year 1</option>
                                            <option value="2">Year 2</option>
                                            <option value="3">Year 3</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="profile-form-group">
                                    <label>School</label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={editedProfile.school}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editedProfile.phone}
                                        onChange={handleChange}
                                        className="profile-input"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        value={editedProfile.bio}
                                        onChange={handleChange}
                                        className="profile-textarea"
                                        rows="3"
                                    />
                                </div>

                                <div className="profile-form-actions">
                                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="button" className="save-btn" onClick={handleSave}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-info">
                                <div className="profile-info-item">
                                    <span className="info-label">Full Name</span>
                                    <span className="info-value">{profile.name || '-'}</span>
                                </div>

                                <div className="profile-info-item">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{profile.email || '-'}</span>
                                </div>

                                <div className="profile-info-row">
                                    <div className="profile-info-item">
                                        <span className="info-label">Student ID</span>
                                        <span className="info-value">{profile.studentId || '-'}</span>
                                    </div>

                                    <div className="profile-info-item">
                                        <span className="info-label">Year of Study</span>
                                        <span className="info-value">{profile.year ? `Year ${profile.year}` : '-'}</span>
                                    </div>
                                </div>

                                <div className="profile-info-item">
                                    <span className="info-label">School</span>
                                    <span className="info-value">{profile.school || '-'}</span>
                                </div>

                                <div className="profile-info-item">
                                    <span className="info-label">Phone Number</span>
                                    <span className="info-value">{profile.phone || '-'}</span>
                                </div>

                                <div className="profile-info-item">
                                    <span className="info-label">Bio</span>
                                    <span className="info-value">{profile.bio || '-'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    </div>
);
};

export default ProfilePage;
