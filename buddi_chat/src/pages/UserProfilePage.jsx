import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Loader, ErrorMessage, Button } from '../components/ui';
import api from '../services/apiService';
import logger from '../utils/logger';
import { DEFAULT_AVATAR, APP_ROUTES } from '../constants';
import useAuth from '../hooks/useAuth';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      try {
        logger.debug(`Initiating profile fetch for user: ${userId}`);
        const response = await api.get(`/users/${userId}`, {
          signal: controller.signal
        });

        setProfile(response.data);
        setError(null);
        logger.info('Profile data loaded successfully', { userId });
      } catch (err) {
        if (!controller.signal.aborted) {
          logger.error('Profile load failed', err);
          setError({
            code: err.response?.status || 500,
            message: err.response?.data?.message || 'Failed to load profile data'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }

    return () => controller.abort();
  }, [userId]);

  const handleEditProfile = () => {
    navigate(APP_ROUTES.EDIT_PROFILE);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <ErrorMessage 
        code={error.code}
        message={error.message}
        retry={() => window.location.reload()}
      />
    );
  }

  if (!profile) {
    return <Navigate to={APP_ROUTES.NOT_FOUND} replace />;
  }

  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="profile-container container py-5">
      <Card className="mx-auto profile-card">
        <div className="profile-header text-center p-4">
          <img
            src={profile.profilePicture || DEFAULT_AVATAR}
            alt={`${profile.username}'s profile`}
            className="profile-avatar rounded-circle"
            width="150"
            height="150"
            loading="lazy"
          />
          <h1 className="profile-username mt-3">
            {profile.username}
          </h1>
          {profile.bio && (
            <p className="profile-bio text-muted mt-2">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="profile-details p-4">
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{profile.email}</span>
          </div>
          
          {profile.joinedDate && (
            <div className="detail-item">
              <span className="detail-label">Member since:</span>
              <span className="detail-value">
                {new Date(profile.joinedDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {isCurrentUser && (
          <div className="profile-actions p-4 border-top">
            <Button
              variant="primary"
              onClick={handleEditProfile}
              aria-label="Edit profile"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserProfile;
