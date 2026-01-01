import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Chats', path: '/chat-room' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <motion.div
                className="nav-icon-wrapper"
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { y: -4, color: 'var(--primary)' } : { y: 0 }}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="active-dot"
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    marginTop: '2px'
                  }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
