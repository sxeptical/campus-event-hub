import { useState } from 'react';
import { NavLink } from 'react-router';

const DashboardPage = () => {
  // Sample registered events data
  const [registeredEvents, setRegisteredEvents] = useState([
    {
      id: 1,
      title: 'Beach cleanup',
      date: '2 Dec 2025',
      location: 'East Coast Park',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop'
    }
  ]);

  const [eventHistory] = useState([]);

  const handleUnregister = (eventId) => {
    setRegisteredEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const nextEvent = registeredEvents.length > 0 ? registeredEvents[0] : null;

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
        <div className="dashboard-content">
          {/* Top Section */}
          <div className="dashboard-top-section">
            {/* Upcoming Events */}
            <div className="upcoming-events-section">
              <h2 className="section-title">Upcoming events:</h2>
              <div className="upcoming-events-list">
                {registeredEvents.length > 0 ? (
                  registeredEvents.map(event => (
                    <div key={event.id} className="registered-event-card">
                      <div className="registered-event-image">
                        <img src={event.image} alt={event.title} />
                      </div>
                      <div className="registered-event-details">
                        <h3 className="registered-event-title">{event.title}</h3>
                        <p className="registered-event-date">{event.date}</p>
                        <p className="registered-event-location">{event.location}</p>
                      </div>
                      <button 
                        className="unregister-btn"
                        onClick={() => handleUnregister(event.id)}
                      >
                        Unregister
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-events-text">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Next Event */}
            <div className="next-event-section">
              <h2 className="section-title">Next event:</h2>
              <div className="next-event-card">
                {nextEvent ? (
                  <>
                    <p className="next-event-title">{nextEvent.title}</p>
                    <p className="next-event-date">{nextEvent.date}</p>
                  </>
                ) : (
                  <p className="no-events-text">No upcoming events</p>
                )}
              </div>
            </div>
          </div>

          {/* Event History */}
          <div className="event-history-section">
            <h2 className="section-title">Event History:</h2>
            <div className="event-history-content">
              {eventHistory.length > 0 ? (
                eventHistory.map(event => (
                  <div key={event.id} className="history-event-card">
                    <p>{event.title}</p>
                  </div>
                ))
              ) : (
                <p className="no-history-text">You have not participated in any events previously</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;