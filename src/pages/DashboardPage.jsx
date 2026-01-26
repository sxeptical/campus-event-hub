import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { formatDate, getUser } from "../utils";
import API_URL from "../config";

const DashboardPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventHistory, setEventHistory] = useState([]);

  const user = getUser();
  const isOrganiser = user?.role === "Organiser";

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id || user.id;
      const response = await fetch(`${API_URL}/registrations?userId=${userId}`);
      const registrations = await response.json();

      // Map registrations to event format for display
      const events = registrations.map((reg) => ({
        id: reg._id || reg.id,
        eventId: reg.eventId,
        title: reg.eventTitle,
        date: reg.eventDate,
        location: reg.eventLocation,
        image: reg.eventImage,
      }));

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const todayString = `${year}-${month}-${day}`;

      const upcoming = events.filter((event) => event.date >= todayString);
      const past = events.filter((event) => event.date < todayString);

      // Sort events by date (earliest first)
      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
      past.sort((a, b) => new Date(b.date) - new Date(a.date));

      setRegisteredEvents(upcoming);
      setEventHistory(past);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (registrationId, eventId, eventTitle) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to unregister from "${eventTitle}"?`,
    );

    if (!confirmed) return;

    try {
      // Delete registration
      await fetch(`${API_URL}/registrations/${registrationId}`, {
        method: "DELETE",
      });

      setRegisteredEvents((prev) =>
        prev.filter((event) => event.id !== registrationId),
      );

      // Update notifications
      window.dispatchEvent(new CustomEvent("newRegistration"));
    } catch (error) {
      console.error("Error unregistering:", error);
      alert("Failed to unregister. Please try again.");
    }
  };

  const nextEvent = registeredEvents.length > 0 ? registeredEvents[0] : null;

  if (loading) {
    return (
      <div className="dashboard-layout">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          {isOrganiser && (
            <NavLink
              to="/manage-events"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              Manage Events
            </NavLink>
          )}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
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
                  registeredEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="registered-event-card">
                      <div className="registered-event-image">
                        {event.image && (
                          <img src={event.image} alt={event.title} />
                        )}
                      </div>
                      <div className="registered-event-details">
                        <h3 className="registered-event-title">
                          {event.title}
                        </h3>
                        <p className="registered-event-date">
                          {formatDate(event.date)}
                        </p>
                        <p className="registered-event-location">
                          {event.location}
                        </p>
                      </div>
                      <button
                        className="unregister-btn"
                        onClick={() =>
                          handleUnregister(event.id, event.eventId, event.title)
                        }
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
                    <p className="next-event-date">
                      {formatDate(nextEvent.date)}
                    </p>
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
                eventHistory.map((event) => (
                  <div key={event.id} className="history-event-card">
                    <div className="history-event-image">
                      {event.image && (
                        <img src={event.image} alt={event.title} />
                      )}
                    </div>
                    <div className="history-event-details">
                      <h3 className="history-event-title">{event.title}</h3>
                      <p className="history-event-date">
                        {formatDate(event.date)}
                      </p>
                      <p className="history-event-location">{event.location}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-history-text">
                  You have not participated in any events previously
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
