import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCcw, X, Info } from 'lucide-react';
import { useState } from 'react';

const AiSummaryPanel = ({ summary, onRefresh, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ai-summary-container position-relative mb-4">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            layoutId="panel"
            onClick={() => setIsOpen(true)}
            className="w-100 d-flex align-items-center justify-content-between p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20 text-primary scale-hover"
          >
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-primary rounded-3 text-white">
                <Sparkles size={18} />
              </div>
              <div className="text-start">
                <div className="fw-bold small">Catch up in seconds</div>
                <div className="text-secondary opacity-75" style={{ fontSize: '0.7rem' }}>AI has generated a summary of recent activity.</div>
              </div>
            </div>
            <Info size={16} className="opacity-50" />
          </motion.button>
        ) : (
          <motion.div
            layoutId="panel"
            className="p-4 rounded-4 bg-surface-mid border border-color shadow-premium"
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                <h6 className="fw-bold m-0">Conversation Summary</h6>
              </div>
              <div className="d-flex gap-2">
                <button 
                    onClick={onRefresh} 
                    disabled={loading}
                    className="p-2 rounded-circle border-0 bg-secondary bg-opacity-50 text-secondary hover-primary transition-smooth"
                >
                  <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-circle border-0 bg-secondary bg-opacity-50 text-secondary hover-bg transition-smooth"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="bg-main bg-opacity-50 p-3 rounded-3 border border-color mb-3">
                <p className="small text-secondary m-0 line-height-relaxed">
                    {summary || "No active conversations to summarize yet."}
                </p>
            </div>

            <div className="d-flex align-items-center gap-2 text-secondary opacity-50" style={{ fontSize: '0.6rem' }}>
                <Info size={12} />
                <span>AI summaries are generated based on the last 50 messages.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiSummaryPanel;
