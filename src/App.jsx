import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from '@/components/organisms/Navigation';
import EventsPage from '@/components/pages/EventsPage';
import CreateEventPage from '@/components/pages/CreateEventPage';
import EditEventPage from '@/components/pages/EditEventPage';
import EventDetailsPage from '@/components/pages/EventDetailsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-surface-900 via-slate-900 to-surface-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/edit/:id" element={<EditEventPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/parties" element={<EventsPage eventType="party" />} />
          <Route path="/birthdays" element={<EventsPage eventType="birthday" />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
          }}
          style={{
            zIndex: 9999,
          }}
        />
      </div>
    </Router>
  );
}

export default App;