import { motion } from 'framer-motion';
import { MessageSquare, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <motion.div 
      className="container mt-5 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3" style={{ background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to Buddi Chat
        </h1>
        <p className="lead text-muted">A production-grade, secure, and intelligent chat experience.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {[
          { icon: MessageSquare, title: 'Real-time Chat', text: 'Instant communication with secure WebSocket connections.', color: '#6366f1' },
          { icon: ShieldCheck, title: 'Enterprise Security', text: 'JWT Auth, HttpOnly Cookies, and CSRF protection.', color: '#10b981' },
          { icon: Users, title: 'Room Moderation', text: 'Advanced room membership and access control.', color: '#f59e0b' },
        ].map((feature, i) => (
          <motion.div 
            key={i} 
            className="col-md-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
          >
            <div className="glass-card p-4 h-100 border-0 text-center">
              <div className="mb-3 d-inline-flex p-3 rounded-4" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                <feature.icon size={32} />
              </div>
              <h4>{feature.title}</h4>
              <p className="small text-muted mb-0">{feature.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-5">
        <Link to="/chat-room" className="btn-premium d-inline-block text-decoration-none shadow-lg">
          {user ? 'Go to Chat Room' : 'Get Started'}
        </Link>
      </div>
    </motion.div>
  );
};

export default HomePage;
