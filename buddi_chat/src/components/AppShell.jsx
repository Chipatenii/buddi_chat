import { motion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  User as UserIcon, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Avatar } from './ui';

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: <MessageSquare size={22} />, label: 'Chat', path: '/' },
    { icon: <Users size={22} />, label: 'Rooms', path: '/rooms' },
    { icon: <Settings size={22} />, label: 'Settings', path: '/settings' },
    { icon: <UserIcon size={22} />, label: 'Profile', path: `/profile/${user?.id}` },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column flex-lg-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="d-none d-lg-flex flex-column bg-surface-low border-end border-color px-3 py-4" style={{ width: '280px' }}>
        <div className="d-flex align-items-center gap-2 mb-5 px-2">
          <div className="p-2 bg-primary rounded-3 text-white">
            <MessageSquare size={24} />
          </div>
          <h4 className="m-0 fw-bold">Buddi Chat</h4>
        </div>

        <nav className="flex-grow-1 d-flex flex-column gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-smooth ${
                location.pathname === item.path 
                  ? 'bg-primary text-white shadow-premium' 
                  : 'text-secondary hover-bg'
              }`}
            >
              {item.icon}
              <span className="fw-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-top border-color">
          <div className="d-flex align-items-center gap-3 px-2 mb-4">
            <Avatar src={user?.profilePicture} name={user?.username} size="md" border />
            <div className="overflow-hidden">
              <div className="fw-semibold text-truncate">{user?.username}</div>
              <div className="small text-secondary text-truncate">{user?.email}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-100 d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 bg-transparent text-secondary hover-bg transition-smooth"
          >
            <LogOut size={20} />
            <span className="fw-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="d-lg-none bg-surface-low border-bottom border-color px-4 py-3 d-flex justify-content-between align-items-center sticky-top">
        <div className="d-flex align-items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          <span className="fw-bold">Buddi</span>
        </div>
        <button 
          className="border-0 bg-transparent text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow-1 overflow-auto position-relative main-layout-animation">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-100"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="d-lg-none bg-surface-low border-top border-color d-flex justify-content-around py-3 pb-safe fixed-bottom z-high">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`d-flex flex-column align-items-center gap-1 text-decoration-none ${
              location.pathname === item.path ? 'text-primary' : 'text-secondary'
            }`}
          >
            {item.icon}
            <span style={{ fontSize: '0.65rem' }}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed-inset z-max d-lg-none">
          <div className="absolute-inset bg-dark bg-opacity-80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="position-relative bg-surface-mid h-100 p-4"
            style={{ width: '80%', maxWidth: '300px' }}
          >
             {/* Content similar to desktop sidebar for mobile drawer */}
             <div className="d-flex align-items-center gap-2 mb-5">
              <MessageSquare size={24} className="text-primary" />
              <h4 className="m-0 fw-bold">Buddi Chat</h4>
            </div>
            <div className="d-flex flex-column gap-3">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="d-flex align-items-center gap-3 text-decoration-none text-secondary py-2"
                >
                  {item.icon}
                  <span className="fw-medium">{item.label}</span>
                </Link>
              ))}
              <button 
                onClick={logout}
                className="d-flex align-items-center gap-3 border-0 bg-transparent text-secondary py-2 text-start px-0"
              >
                <LogOut size={20} />
                <span className="fw-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AppShell;
