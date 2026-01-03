import { useState } from 'react';
import EventCard from '../components/EventCard';

const sampleEvents = [
  {
    id: 1,
    title: 'Beach Cleanup',
    description: 'Want to play your part in the community? Join us for a beach cleanup at East Coast Park to take a break from assignments and studies. Bring friends along too!',
    date: '2 Dec 2025 (Tuesday)',
    time: '11am to 2pm',
    location: 'East Coast Park',
    organiser: 'Community Service Club',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    slotsAvailable: 12,
    totalSlots: 25
  },
  {
    id: 2,
    title: 'Open House Guide',
    description: 'We are looking for passionate and enthusiastic students to be guides for our upcoming open house event. Help prospective students learn about campus life!',
    date: '15 Dec 2025 (Monday)',
    time: '9am to 5pm',
    location: 'Main Campus',
    organiser: 'Student Union',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    slotsAvailable: 20,
    totalSlots: 30
  },
  {
    id: 3,
    title: 'Walk for Health',
    description: 'Invite your friends and walk with us for a better cause. Join our annual charity walk to raise awareness for mental health and wellness.',
    date: '10 Dec 2025 (Wednesday)',
    time: '7am to 10am',
    location: 'Sports Complex',
    organiser: 'Student Union',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=300&fit=crop',
    slotsAvailable: 45,
    totalSlots: 100
  },
  {
    id: 4,
    title: 'Career Fair',
    description: 'Come and learn more about future career paths with top companies from various industries. Network with recruiters and explore internship opportunities!',
    date: '20 Dec 2025 (Saturday)',
    time: '10am to 4pm',
    location: 'Convention Hall',
    organiser: 'Student Management',
    image: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=400&h=300&fit=crop',
    slotsAvailable: 150,
    totalSlots: 200
  }
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = sampleEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="events-container">
      <div className="events-header">
        <h2 className="events-title">Recents</h2>
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
      
      <div className="events-grid">
        {filteredEvents.map(event => (
          <div 
            key={event.id} 
            className="event-preview-card"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="event-preview-image">
              <img src={event.image} alt={event.title} />
            </div>
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