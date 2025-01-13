import { useState } from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSaveSettings = () => {
    alert('Settings updated!');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Home</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">|</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">|</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/settings">Settings</Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">|</span>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => alert('Logged out!')}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Settings Content */}
      <div className="container my-4">
        <h2 className="mb-4">Settings</h2>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="notifications"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
          <label className="form-check-label" htmlFor="notifications">
            Enable Notifications
          </label>
        </div>
        <div className="mb-3">
          <label htmlFor="theme" className="form-label">
            Theme:
          </label>
          <select
            id="theme"
            className="form-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleSaveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;