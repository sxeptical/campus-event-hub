import { useState } from 'react';

const EventCard = ({ event, onClose }) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    // Simulate application process
    setTimeout(() => {
      setIsApplying(false);
      alert('Successfully applied to ' + event.title + '!');
    }, 1000);
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="event-modal-content">
          <div className="event-modal-image">
            <img src={event.image} alt={event.title} />
          </div>
          
          <div className="event-modal-details">
            <h2 className="event-modal-title">{event.title}</h2>
            
            <p className="event-modal-description">{event.description}</p>
            
            <div className="event-modal-info">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Organiser:</strong> {event.organiser}</p>
            </div>
            
            <p className="event-slots">
              Slots available: <span className="slots-count">{event.slotsAvailable}/{event.totalSlots}</span>
            </p>
            
            <button 
              className="event-apply-btn" 
              onClick={handleApply}
              disabled={isApplying || event.slotsAvailable === 0}
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
