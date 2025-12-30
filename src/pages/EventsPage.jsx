import { useState } from 'react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">Recents</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Find events you like"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-full w-64 text-sm focus:outline-none focus:border-purple-600"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
      <p className="text-gray-600">Events will be displayed here...</p>
    </div>
  );
};

export default EventsPage;