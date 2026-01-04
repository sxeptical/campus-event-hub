import { NavLink, Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { formatDate } from '../utils';

function NavBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const user = JSON.parse(userString);
        const response = await fetch(`http://localhost:5050/registrations?userId=${user.id}`);
        const registrations = await response.json();
        
        if (!isMounted) return;
        
        // Create notifications from registrations
        const notifs = registrations.map(reg => ({
          id: reg.id,
          message: `You're registered for ${reg.eventTitle}`,
          date: reg.eventDate,
          registeredAt: reg.registeredAt
        }));
        
        // Sort by registeredAt (latest first), fallback to id if no timestamp
        notifs.sort((a, b) => {
          if (a.registeredAt && b.registeredAt) {
            return new Date(b.registeredAt) - new Date(a.registeredAt);
          }
          // Fallback to id (higher id = newer registration)
          return b.id - a.id;
        });
        
        setNotifications(notifs);
        
        // Check how many are unread
        const lastReadCount = localStorage.getItem('lastReadNotificationCount') || 0;
        const newUnread = notifs.length - parseInt(lastReadCount);
        setUnreadCount(newUnread > 0 ? newUnread : 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Listen for new registrations
    const handleNewRegistration = () => {
      fetchNotifications();
    };

    window.addEventListener('newRegistration', handleNewRegistration);
    
    return () => {
      isMounted = false;
      window.removeEventListener('newRegistration', handleNewRegistration);
    };
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark as read when opening
      localStorage.setItem('lastReadNotificationCount', notifications.length.toString());
      setUnreadCount(0);
    }
  };

  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          Campus Event Hub
        </Link>
        <div className="navbar-links">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
        </div>
      </div>
      <div className="navbar-right">
        <div className="notification-container" ref={notificationRef}>
          <button 
            className="notification-btn"
            onClick={handleBellClick}
          >
            <svg className="bell-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
              <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
            </svg>
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-popup">
              <div className="notification-header">
                <h3>Notifications</h3>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="notification-item">
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-date">{formatDate(notif.date)}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
