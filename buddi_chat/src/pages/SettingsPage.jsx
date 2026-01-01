import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Shield, Save } from 'lucide-react';
import { Button } from '../components/ui';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');

  const handleSaveSettings = () => {
    alert('Settings updated!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mt-5 px-4"
    >
      <div className="mb-5">
        <h2 className="fw-bold mb-2">Settings</h2>
        <p className="text-muted small">Manage your preferences and account security</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card overflow-hidden">
            {/* Preferences Section */}
            <div className="p-4 border-bottom border-secondary" style={{ borderOpacity: 0.1 }}>
              <h5 className="mb-4 d-flex align-items-center gap-2">
                <Bell size={20} className="text-primary" />
                Preferences
              </h5>
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <div className="fw-semibold">Push Notifications</div>
                  <div className="small text-muted">Receive alerts for new messages</div>
                </div>
                <div className="form-check form-switch cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-check-input cursor-pointer shadow-none"
                    style={{ scale: '1.2' }}
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-0">
                <div>
                  <div className="fw-semibold">Color Theme</div>
                  <div className="small text-muted">Switch between light and dark mode</div>
                </div>
                <div className="d-flex bg-dark bg-opacity-50 p-1 rounded-3">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`btn btn-sm border-0 rounded-2 py-1 px-3 ${theme === 'light' ? 'bg-secondary text-white' : 'text-muted'}`}
                  >
                    <Sun size={14} className="me-1" /> Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`btn btn-sm border-0 rounded-2 py-1 px-3 ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted'}`}
                  >
                    <Moon size={14} className="me-1" /> Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="p-4">
              <h5 className="mb-4 d-flex align-items-center gap-2">
                <Shield size={20} className="text-accent" />
                Security
              </h5>
              <div className="p-3 rounded-3 bg-dark bg-opacity-25 border border-secondary border-opacity-10 mb-4">
                <div className="small fw-semibold mb-1">Two-Factor Authentication</div>
                <div className="small text-muted mb-3">Add an extra layer of security to your account.</div>
                <Button variant="secondary" size="sm">Enable 2FA</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 text-center">
            <h5 className="mb-3">Quick Actions</h5>
            <Button 
              onClick={handleSaveSettings} 
              className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </Button>
            <p className="small text-muted mt-3 mb-0">
              Last synced: Today at 2:45 PM
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
