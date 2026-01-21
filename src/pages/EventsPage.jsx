import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import { getUser } from "../utils";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
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
  const [validationError, setValidationError] = useState("");

  const user = getUser();
  const isOrganiser = user?.role === "Organiser";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5050/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .reverse();

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setValidationError("");

    const slotsAvailable = parseInt(newEvent.slotsAvailable);
    const totalSlots = parseInt(newEvent.totalSlots);

    if (totalSlots > 500) {
      setValidationError("Total slots cannot exceed 500");
      return;
    }

    if (slotsAvailable > totalSlots) {
      setValidationError("Available slots cannot be more than total slots");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          createdBy: user?._id || user?.id,
          slotsAvailable: parseInt(newEvent.slotsAvailable),
          totalSlots: parseInt(newEvent.totalSlots),
        }),
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
        setShowAddForm(false);
        setNewEvent({
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
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  if (loading) {
    return (
      <div className="events-container">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h2 className="events-title">Recents</h2>
        <div className="events-header-right">
          {isOrganiser && (
            <button
              className="add-event-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Add Event
            </button>
          )}
          <div className="search-group">
            <svg className="search-icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="add-event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Event</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="add-event-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="e.g., 9am to 5pm"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Organiser</label>
                <input
                  type="text"
                  value={newEvent.organiser}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, organiser: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newEvent.image}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, image: e.target.value })
                  }
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Available Slots</label>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.slotsAvailable}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        slotsAvailable: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Slots</label>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.totalSlots}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, totalSlots: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              {validationError && (
                <div
                  className="validation-error"
                  style={{ color: "red", marginBottom: "10px" }}
                >
                  {validationError}
                </div>
              )}
              <button type="submit" className="submit-event-btn">
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="event-preview-card"
            onClick={() => setSelectedEvent(event)}
          >
            {event.image && (
              <div className="event-preview-image">
                <img src={event.image} alt={event.title} />
              </div>
            )}
            <div className="event-preview-content">
              <h3 className="event-preview-title">{event.title}</h3>
              <p className="event-preview-description">{event.description}</p>
              <p className="event-preview-organiser">{event.organiser}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <EventCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsPage;
