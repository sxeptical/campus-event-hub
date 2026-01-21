import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { formatDate, getUser } from "../utils";

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organiser: "",
    image: "",
    slotsAvailable: 0,
    totalSlots: 0,
  });

  const user = getUser();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const userId = user._id || user.id;
      const response = await fetch(
        `http://localhost:5050/events?createdBy=${userId}`,
      );
      const data = await response.json();
      setEvents(data.reverse());
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      organiser: event.organiser,
      image: event.image || "",
      slotsAvailable: event.slotsAvailable,
      totalSlots: event.totalSlots,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5050/events/${editingEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editingEvent,
            ...editForm,
            slotsAvailable: parseInt(editForm.slotsAvailable),
            totalSlots: parseInt(editForm.totalSlots),
          }),
        },
      );

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(
          events.map((e) => (e._id === updatedEvent._id ? updatedEvent : e)),
        );
        setEditingEvent(null);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const handleDelete = async (eventId, eventTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5050/events/${eventId}`, {
        method: "DELETE",
      });

      const regResponse = await fetch(
        `http://localhost:5050/registrations?eventId=${eventId}`,
      );
      const registrations = await regResponse.json();

      for (const reg of registrations) {
        await fetch(`http://localhost:5050/registrations/${reg.id}`, {
          method: "DELETE",
        });
      }

      setEvents(events.filter((e) => e._id !== eventId));
      alert("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
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
          <NavLink
            to="/manage-events"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            Manage Events
          </NavLink>
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

      <main className="dashboard-main">
        <div className="manage-events-content">
          <h2 className="section-title">Manage Events</h2>

          <div className="manage-events-list">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} className="manage-event-card">
                  {event.image && (
                    <div className="manage-event-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                  )}
                  <div className="manage-event-details">
                    <h3 className="manage-event-title">{event.title}</h3>
                    <p className="manage-event-date">
                      {formatDate(event.date)}
                    </p>
                    <p className="manage-event-location">{event.location}</p>
                    <p className="manage-event-organiser">
                      By: {event.organiser}
                    </p>
                    <p className="manage-event-slots">
                      Slots: {event.slotsAvailable}/{event.totalSlots}
                    </p>
                  </div>
                  <div className="manage-event-actions">
                    <button
                      className="edit-event-btn"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-event-btn"
                      onClick={() => handleDelete(event._id, event.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-events-text">No events to manage</p>
            )}
          </div>
        </div>
      </main>

      {editingEvent && (
        <div className="modal-overlay" onClick={() => setEditingEvent(null)}>
          <div className="add-event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Event</h3>
              <button
                className="modal-close"
                onClick={() => setEditingEvent(null)}
              >
                ×
              </button>
            </div>
            <form
              className="add-event-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g., 9am to 5pm"
                    value={editForm.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Organiser</label>
                <input
                  type="text"
                  name="organiser"
                  value={editForm.organiser}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={editForm.image}
                  onChange={handleChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Available Slots</label>
                  <input
                    type="number"
                    name="slotsAvailable"
                    min="0"
                    max="500"
                    value={editForm.slotsAvailable}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Slots</label>
                  <input
                    type="number"
                    name="totalSlots"
                    min="0"
                    max="500"
                    value={editForm.totalSlots}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-event-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEventsPage;
