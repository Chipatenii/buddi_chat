import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Sun, Shield, User, Sparkles } from 'lucide-react';
import { InputField, PrimaryButton } from '../components/ui';


const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
        setSaving(false);
        alert('Settings updated successfully!');
    }, 1000);
  };

  const sections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: <User size={20} className="text-primary" />,
      description: 'Manage your public identity and personal information.',
      content: (
        <div className="d-flex flex-column gap-3">
            <InputField label="Display Name" defaultValue="John Doe" />
            <InputField label="Bio" defaultValue="AI enthusiast and developer." type="textarea" />
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={20} className="text-accent" />,
      description: 'Configure how and when you receive alerts.',
      content: (
        <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-dark bg-opacity-30 border border-color">
            <div className="small">
                <div className="fw-bold">Push Notifications</div>
                <div className="text-secondary opacity-50">New messages and activity</div>
            </div>
            <div className="form-check form-switch">
                <input 
                    className="form-check-input cursor-pointer" 
                    type="checkbox" 
                    checked={notifications} 
                    onChange={() => setNotifications(!notifications)} 
                />
            </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Shield size={20} className="text-secondary" />,
      description: 'Keep your account safe and secure.',
      content: (
        <div className="d-flex flex-column gap-3">
            <div className="p-3 rounded-3 bg-dark bg-opacity-30 border border-color d-flex justify-content-between align-items-center">
                <div className="small">
                    <div className="fw-bold">Two-Factor Authentication</div>
                    <div className="text-secondary opacity-50">Currently disabled</div>
                </div>
                <button className="btn btn-sm btn-outline-light border-color small px-3">Enable</button>
            </div>
            <div className="p-3 rounded-3 bg-dark bg-opacity-30 border border-color d-flex justify-content-between align-items-center">
                <div className="small">
                    <div className="fw-bold">Password</div>
                    <div className="text-secondary opacity-50">Last changed 3 months ago</div>
                </div>
                <button className="btn btn-sm btn-outline-light border-color small px-3">Update</button>
            </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-vh-100 bg-main p-4 p-md-5 overflow-auto">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="mb-5">
            <h1 className="fw-bold display-6 mb-2">Account Settings</h1>
            <p className="text-secondary small">Precision controls for your Buddi experience.</p>
        </div>

        <div className="row g-5">
            <div className="col-lg-8">
                <div className="d-flex flex-column gap-5">
                    {sections.map(section => (
                        <div key={section.id} className="settings-section">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-2 bg-surface-high rounded-3 border border-color shadow-sm">
                                    {section.icon}
                                </div>
                                <h5 className="fw-bold m-0">{section.title}</h5>
                            </div>
                            <p className="small text-secondary mb-4 opacity-75">{section.description}</p>
                            <div className="p-1">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-lg-4">
                <div className="position-sticky top-0 pt-2">
                    <div className="p-4 rounded-4 bg-surface-low border border-color shadow-premium text-center">
                        <div className="p-3 bg-primary bg-opacity-10 rounded-circle d-inline-flex mb-3">
                            <Sparkles className="text-primary" size={24} />
                        </div>
                        <h6 className="fw-bold mb-2">Ready to save?</h6>
                        <p className="small text-secondary mb-4">Ensure all changes are correct before proceeding.</p>
                        
                        <PrimaryButton 
                            className="w-100 py-3 mb-2" 
                            onClick={handleSaveSettings}
                            loading={saving}
                        >
                            Save All Changes
                        </PrimaryButton>
                        
                        <button className="btn btn-link text-secondary small text-decoration-none hover-text-white transition-smooth">
                            Discard and Reset
                        </button>
                    </div>
                    
                    <div className="mt-4 p-4 rounded-4 bg-danger bg-opacity-5 border border-danger border-opacity-10">
                        <h6 className="fw-bold text-danger mb-2 small">Danger Zone</h6>
                        <p className="small text-secondary mb-3 opacity-75">Permanently delete your account and data.</p>
                        <button className="btn btn-outline-danger btn-sm w-100">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
