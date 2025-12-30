import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import NavBar from './components/NavBar';
import EventsPage from './pages/EventsPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
