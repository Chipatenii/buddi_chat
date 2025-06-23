import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Button, Card, Loader, ErrorMessage } from '../components/ui'; // Shared UI components
import { fetchUserProfile } from '../services/userService'; // Centralized API service
import logger from '../utils/logger';
import { APP_ROUTES } from '../constants';
import useAuth from '../hooks/useAuth';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        logger.debug(`Fetching profile for user: ${userId}`);
        const userData = await fetchUserProfile(userId, {
          signal: controller.signal
        });
        
        setProfile(userData);
        setError(null);
        logger.info('Profile loaded successfully', { userId });
      } catch (error) {
        if (error.name !== 'AbortError') {
          logger.error('Profile load failed', error);
          setError({
            code: error.response?.status || 500,
            message: error.response?.data?.message || 'Failed to load profile'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }

    return () => controller.abort();
  }, [userId]);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <ErrorMessage 
        code={error.code}
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!profile) {
    return <Navigate to={APP_ROUTES.NOT_FOUND} replace />;
  }

  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="profile-page container py-4">
      <Card className="mx-auto" style={{ maxWidth: '800px' }}>
        <div className="profile-header text-center p-4">
          <img
            src={profile.profilePicture || '/images/default-avatar.jpg'}
            alt={`${profile.username}'s profile`}
            className="profile-picture rounded-circle mb-3"
            width="150"
            height="150"
          />
          <h1 className="profile-username h2 mb-2">
            {profile.username}
          </h1>
          {profile.bio && (
            <p className="profile-bio text-muted lead mb-4">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="profile-details p-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <h3 className="h5 mb-3">Contact Information</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Email:</strong> {profile.email}
                </li>
                {profile.phone && (
                  <li className="mb-2">
                    <strong>Phone:</strong> {profile.phone}
                  </li>
                )}
              </ul>
            </div>

            <div className="col-md-6 mb-3">
              <h3 className="h5 mb-3">Activity</h3>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}
                </li>
                <li className="mb-2">
                  <strong>Last Active:</strong> {new Date(profile.lastLogin).toLocaleString()}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {isCurrentUser && (
          <div className="profile-actions p-4 border-top">
            <Button
              as={Link}
              to={APP_ROUTES.EDIT_PROFILE}
              variant="primary"
              className="me-2"
            >
              Edit Profile
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(APP_ROUTES.CHANGE_PASSWORD)}
            >
              Change Password
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
