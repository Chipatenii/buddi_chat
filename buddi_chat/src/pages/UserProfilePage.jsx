import { AnimatePresence, motion } from 'framer-motion';
import { User, Mail, Calendar, Edit3, ArrowLeft } from 'lucide-react';
import { Loader, PrimaryButton } from '../components/ui';
import api from '../services/apiService';
import useAuth from '../hooks/useAuth';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.status || 500);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  if (loading) return <Loader fullScreen />;
  if (error === 404) return <Navigate to="/not-found" replace />;
  if (!profile) return null;

  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="min-vh-100 bg-main overflow-auto">
      {/* Cover Header */}
      <div 
        className="position-relative overflow-hidden" 
        style={{ 
            height: '240px', 
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--surface-mid) 100%)' 
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-50 bg-mesh" />
        <div className="position-absolute bottom-0 start-0 w-100 h-50 bg-gradient-to-t from-bg-main to-transparent" />
        
        <button 
            onClick={() => navigate(-1)}
            className="position-absolute top-0 start-0 m-4 p-2 rounded-circle border-0 bg-dark bg-opacity-40 text-white hover-bg transition-smooth flex-center z-1"
        >
            <ArrowLeft size={20} />
        </button>
      </div>

      <div className="container px-4" style={{ marginTop: '-80px' }}>
        <div className="row justify-content-center">
            <div className="col-xl-9">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4 mb-5 text-center text-md-start px-md-4">
                    <div className="position-relative">
                        <div className="rounded-circle p-1 bg-main shadow-premium">
                             <img
                                src={profile.profilePicture || 'https://via.placeholder.com/150'}
                                alt={profile.username}
                                className="rounded-circle border border-4 border-surface-low object-fit-cover"
                                style={{ width: 160, height: 160 }}
                            />
                        </div>
                        <div className="position-absolute bottom-0 end-0 bg-accent rounded-circle border border-4 border-main" style={{ width: 24, height: 24 }} />
                    </div>
                    
                    <div className="flex-grow-1 pb-2">
                        <h1 className="display-6 fw-bold m-0">{profile.username}</h1>
                        <p className="text-secondary m-0">{profile.realName}</p>
                        <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-4 mt-3">
                            <div className="d-flex align-items-center gap-2">
                                <Mail size={16} className="text-primary opacity-50" />
                                <span className="small text-secondary">{profile.email}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <Calendar size={16} className="text-primary opacity-50" />
                                <span className="small text-secondary">Joined {new Date(profile.joinedDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {isCurrentUser && (
                        <div className="pb-2">
                            <PrimaryButton className="px-4 py-2 small" onClick={() => navigate('/settings')}>
                                <Edit3 size={16} />
                                Edit Profile
                            </PrimaryButton>
                        </div>
                    )}
                </div>

                {/* Profile Tabs & Content */}
                <div className="row g-4">
                    <div className="col-lg-4">
                         <div className="p-4 rounded-4 bg-surface-low border border-color shadow-premium">
                            <h6 className="fw-bold mb-4 uppercase tracking-wider opacity-50" style={{ fontSize: '0.75rem' }}>About</h6>
                            <p className="small text-secondary line-height-relaxed">
                                {profile.bio || "No bio provided yet."}
                            </p>
                            
                            <hr className="my-4 border-color opacity-10" />
                            
                            <h6 className="fw-bold mb-4 uppercase tracking-wider opacity-50" style={{ fontSize: '0.75rem' }}>Social Stats</h6>
                            <div className="row g-3">
                                <div className="col-6">
                                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-color text-center">
                                        <div className="fw-bold text-primary">2.4k</div>
                                        <div className="text-secondary" style={{ fontSize: '0.6rem' }}>Messages</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-color text-center">
                                        <div className="fw-bold text-accent-cyan">15</div>
                                        <div className="text-secondary" style={{ fontSize: '0.6rem' }}>Rooms</div>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="rounded-4 bg-surface-low border border-color shadow-premium overflow-hidden">
                            <div className="px-4 py-3 bg-dark bg-opacity-20 border-bottom border-color d-flex gap-4">
                                <button className="border-0 bg-transparent text-primary fw-bold small border-bottom border-2 border-primary pb-2">Activity</button>
                                <button className="border-0 bg-transparent text-secondary opacity-50 small pb-2 hover-text-white transition-smooth">Photos</button>
                                <button className="border-0 bg-transparent text-secondary opacity-50 small pb-2 hover-text-white transition-smooth">Badges</button>
                            </div>
                            
                            <div className="p-5 text-center opacity-50">
                                <div className="mb-3 opacity-20">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                                        <Mail size={48} />
                                    </motion.div>
                                </div>
                                <p className="small m-0">No recent public activity to show.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
