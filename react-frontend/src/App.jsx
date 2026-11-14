import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Requirements from './pages/Requirements';
import Plan from './pages/Plan';
import { readTracker, STORAGE_KEY } from './tracker';

export default function App() {
  const [saved, setSaved] = useState(readTracker);
  function updateTracker(data) {
    let error = '';
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      error = 'Changes are only saved for this visit because browser storage is unavailable. Keep this tab open to keep your work.';
    }
    setSaved({ data, error });
  }
  const props = { tracker: saved.data, onChange: updateTracker };
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        {saved.error && <p className="notice error" role="alert">{saved.error}</p>}
        <Routes>
          <Route path="/" element={<Home {...props} />} />
          <Route path="/courses" element={<Courses {...props} />} />
          <Route path="/requirements" element={<Requirements {...props} />} />
          <Route path="/plan" element={<Plan {...props} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>Course Tracker</span>
        <p>Saved in this browser on this device. No account needed. Clearing browser data removes your tracker.</p>
      </footer>
    </BrowserRouter>
  );
}
