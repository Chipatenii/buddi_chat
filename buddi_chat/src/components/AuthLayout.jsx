import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, visualContent }) => {
  return (
    <div className="auth-split-wrapper">
      {/* Visual Side */}
      <div className="auth-visual-side">
        <div className="z-1 position-relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <div className="p-4 bg-primary rounded-4 text-white d-inline-flex shadow-premium mb-4">
              <MessageSquare size={48} />
            </div>
            <h1 className="display-4 fw-bold mb-3 text-white">Buddi Chat.</h1>
            <p className="lead text-secondary opacity-75">
              Secure, lightning-fast communication for the next generation of builders.
            </p>
          </motion.div>
          {visualContent}
        </div>
        
        {/* Background Decorative Element */}
        <div 
          className="position-absolute bottom-0 end-0 opacity-10 pointer-events-none" 
          style={{ transform: 'translate(20%, 20%)', width: '400px', height: '400px' }}
        >
          <div className="w-100 h-100 rounded-circle bg-primary blur-3xl" />
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-4 p-md-5"
        >
          <div className="text-center text-lg-start mb-5">
            <h2 className="fw-bold mb-2">{title}</h2>
            <p className="text-secondary small">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
