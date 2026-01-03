import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

const DashboardPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventHistory] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userString);
      const response = await fetch(`http://localhost:5050/registrations?userId=${user.id}`);
      const registrations = await response.json();
      
      // Map registrations to event format for display
      const events = registrations.map(reg => ({
        id: reg.id,
        eventId: reg.eventId,
        title: reg.eventTitle,
        date: reg.eventDate,
        location: reg.eventLocation,
        image: reg.eventImage
      }));
      
      setRegisteredEvents(events);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (registrationId, eventId, eventTitle) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to unregister from "${eventTitle}"?`);
    
    if (!confirmed) return;
    
    try {
      // Delete registration
      await fetch(`http://localhost:5050/registrations/${registrationId}`, {
        method: 'DELETE',
      });
      
      // Optionally restore event slot
      const eventResponse = await fetch(`http://localhost:5050/events/${eventId}`);
      const event = await eventResponse.json();
      
      await fetch(`http://localhost:5050/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slotsAvailable: event.slotsAvailable + 1 }),
      });
      
      setRegisteredEvents(prev => prev.filter(event => event.id !== registrationId));
      
      // Update notifications
      window.dispatchEvent(new CustomEvent('newRegistration'));
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to unregister. Please try again.');
    }
  };

  const nextEvent = registeredEvents.length > 0 ? registeredEvents[0] : null;

  if (loading) {
    return <div className="dashboard-layout"><p>Loading...</p></div>;
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
                        onClick={() => handleUnregister(event.id, event.eventId, event.title)}
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