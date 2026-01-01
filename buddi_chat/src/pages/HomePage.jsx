const HomePage = ({ user }) => {
  const features = [
    { 
      icon: <Zap className="text-accent-cyan" size={24} />, 
      title: 'Real-time Sync', 
      desc: 'Experience zero-latency messaging powered by edge WebSockets.' 
    },
    { 
      icon: <ShieldCheck className="text-accent" size={24} />, 
      title: 'End-to-End Secure', 
      desc: 'Your privacy is our priority. Every message is encrypted by default.' 
    },
    { 
      icon: <Sparkles className="text-secondary" size={24} />, 
      title: 'AI Smart Summary', 
      desc: 'Stay caught up in seconds with our intelligent conversation summarizer.' 
    }
  ];

  return (
    <div className="container-fluid px-0 overflow-hidden">
      {/* Hero Section */}
      <section className="min-vh-100 d-flex align-items-center justify-content-center position-relative px-4">
        {/* Animated Background Mesh (Handled by Body for consistency, but adding specialized overlays) */}
        <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none opacity-20">
          <div className="position-absolute top-0 end-0 p-5">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                  <MessageSquare size={120} className="text-primary opacity-20" />
              </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-1"
          style={{ maxWidth: '800px' }}
        >
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary bg-opacity-10 text-primary small fw-semibold mb-4 border border-primary border-opacity-20">
            <Sparkles size={16} />
            <span>Buddi Chat 2026 is here</span>
          </div>
          
          <h1 className="display-2 fw-bold mb-4 tracking-tight">
            Connect. Chat. <span className="gradient-text">Buddi Up.</span>
          </h1>
          
          <p className="lead text-secondary mb-5 px-md-5 opacity-90">
            The next generation of real-time communication. Seamless, secure, and designed for teams that move fast.
          </p>
          
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            {user ? (
              <Link to="/chat-room" className="btn-premium px-5 py-3 text-decoration-none">
                <div className="d-flex align-items-center gap-2">
                  <span>Enter Chat Room</span>
                  <ArrowRight size={20} />
                </div>
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-premium px-5 py-3 text-decoration-none shadow-premium">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-light border-color px-5 py-3 rounded-3 text-decoration-none">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Feature Grid */}
          <div className="row g-4 mt-5 pt-5 text-start">
            {features.map((f, i) => (
              <div key={i} className="col-md-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="p-4 rounded-4 bg-surface-low border border-color h-100 scale-hover shadow-premium"
                >
                  <div className="p-3 bg-dark bg-opacity-50 rounded-3 d-inline-flex mb-3">
                    {f.icon}
                  </div>
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="small text-secondary mb-0 line-height-base">{f.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
