import { useState } from 'react';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSaveSettings = () => {
    alert('Settings updated!');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
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
