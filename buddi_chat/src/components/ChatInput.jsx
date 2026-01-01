import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Send, Image as ImageIcon, FileText, Plus } from 'lucide-react';
import { Button } from './ui';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = memo(({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!message.trim() || disabled || isUploading) return;
    
    onSend(message);
    setMessage('');
  }, [message, onSend, disabled, isUploading]);

  return (
    <div className="chat-input-wrapper p-3">
      <form 
        className="d-flex align-items-center gap-2 bg-dark rounded-4 p-2"
        style={{ 
          backgroundColor: 'rgba(30, 41, 59, 0.5) !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
        onSubmit={handleSubmit}
      >
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-muted p-2"
          onClick={() => setShowActions(!showActions)}
        >
          <motion.div animate={{ rotate: showActions ? 45 : 0 }}>
            <Plus size={24} />
          </motion.div>
        </Button>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="form-control border-0 bg-transparent text-white shadow-none py-2"
          disabled={disabled || isUploading}
          style={{ fontSize: '0.9375rem' }}
        />

        <AnimatePresence>
          {message.trim() && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
                disabled={disabled || isUploading}
              >
                <Send size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="d-flex gap-4 mt-3 px-2 justify-content-center">
              {[
                { icon: ImageIcon, label: 'Image', color: '#6366f1' },
                { icon: FileText, label: 'File', color: '#10b981' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn border-0 d-flex flex-column align-items-center gap-1"
                >
                  <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                    <action.icon size={24} />
                  </div>
                  <span className="small text-muted" style={{ fontSize: '0.7rem' }}>{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ChatInput.displayName = 'ChatInput';

export default ChatInput;
