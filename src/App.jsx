import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import GamePage from '@/components/pages/GamePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-surface-900 via-slate-900 to-surface-900">
        <Routes>
          <Route path="/" element={<GamePage />} />
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