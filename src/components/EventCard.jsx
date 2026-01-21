import { useState } from "react";
import { formatDate } from "../utils";

const EventCard = ({ event, onClose, onRegistered }) => {
  const [isApplying, setIsApplying] = useState(false);

  const eventDate = new Date(event.date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const isPastEvent = eventDate < now;

  const handleApply = async () => {
    setIsApplying(true);

    try {
      // Get logged-in user
      const userString = localStorage.getItem("user");
      if (!userString) {
        alert("Please log in to apply for events");
        setIsApplying(false);
        return;
      }

      const user = JSON.parse(userString);

      // Check if already registered
      const userId = user._id || user.id;
      const eventId = event._id || event.id;

      const checkResponse = await fetch(
        `http://localhost:5050/registrations?userId=${userId}&eventId=${eventId}`,
      );
      const existingRegistrations = await checkResponse.json();

      if (existingRegistrations.length > 0) {
        alert("You have already registered for this event!");
        setIsApplying(false);
        return;
      }

      // Create registration
      // Backend automatically populates event details and decrements slots
      const registrationPayload = {
        userId: userId,
        eventId: eventId,
      };

      const response = await fetch("http://localhost:5050/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      window.dispatchEvent(new CustomEvent("newRegistration"));

      alert("Successfully applied to " + event.title + "!");
      if (onRegistered) onRegistered();
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <div className="event-modal-content">
          {event.image && (
            <div className="event-modal-image">
              <img src={event.image} alt={event.title} />
            </div>
          )}

          <div className="event-modal-details">
            <h2 className="event-modal-title">{event.title}</h2>

            <p className="event-modal-description">{event.description}</p>

            <div className="event-modal-info">
              <p>
                <strong>Date:</strong> {formatDate(event.date)}
              </p>
              <p>
                <strong>Time:</strong> {event.time}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Organiser:</strong> {event.organiser}
              </p>
            </div>

            <p className="event-slots">
              Slots available:{" "}
              <span className="slots-count">
                {event.slotsAvailable}/{event.totalSlots}
              </span>
            </p>

            <button
              className="event-apply-btn"
              onClick={handleApply}
              disabled={isApplying || event.slotsAvailable === 0 || isPastEvent}
            >
              {isApplying
                ? "Applying..."
                : isPastEvent
                  ? "Event Ended"
                  : event.slotsAvailable === 0
                    ? "Full"
                    : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
