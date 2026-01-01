import { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit3, ArrowLeft } from 'lucide-react';
import { Card, Loader, Button } from '../components/ui';
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
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="container py-5 px-4"
    >
      <Button 
        variant="link" 
        onClick={() => navigate(-1)} 
        className="text-muted p-0 mb-4 d-flex align-items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back
      </Button>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <Card className="p-0 border-0">
            {/* Header / Avatar */}
            <div className="position-relative" style={{ height: '160px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              <div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-50px' }}>
                <div className="bg-dark rounded-circle p-1">
                  <div className="rounded-circle overflow-hidden border border-4 border-dark" style={{ width: 120, height: 120 }}>
                    <img
                      src={profile.profilePicture || 'https://via.placeholder.com/150'}
                      alt={profile.username}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 pb-4 px-4 text-center">
              <h3 className="fw-bold m-0">{profile.username}</h3>
              <p className="text-muted small mb-3">{profile.realName}</p>
              
              {profile.bio && (
                <p className="px-lg-5 mb-4 text-muted small mx-auto" style={{ maxWidth: '400px' }}>
                  {profile.bio}
                </p>
              )}

              <div className="d-flex justify-content-center gap-3 mb-4">
                <div className="p-3 bg-dark bg-opacity-25 rounded-4 border border-secondary border-opacity-10 min-w-100" style={{ minWidth: '120px' }}>
                  <div className="fw-bold text-primary">242</div>
                  <div className="small text-muted" style={{ fontSize: '0.65rem' }}>Messages</div>
                </div>
                <div className="p-3 bg-dark bg-opacity-25 rounded-4 border border-secondary border-opacity-10 min-w-100" style={{ minWidth: '120px' }}>
                  <div className="fw-bold text-accent">12</div>
                  <div className="small text-muted" style={{ fontSize: '0.65rem' }}>Rooms</div>
                </div>
              </div>

              {isCurrentUser && (
                <Button className="d-inline-flex align-items-center gap-2 px-4 shadow-lg mb-2">
                  <Edit3 size={16} />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Information Grid */}
            <div className="p-4 bg-dark bg-opacity-50 mt-2">
              <div className="row g-4 text-start">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="small text-muted" style={{ fontSize: '0.7rem' }}>Email Address</div>
                      <div className="small fw-semibold">{profile.email}</div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-accent bg-opacity-10 rounded-3 text-accent">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="small text-muted" style={{ fontSize: '0.7rem' }}>Joined Date</div>
                      <div className="small fw-semibold">{new Date(profile.joinedDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
