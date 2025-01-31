import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './context/ThemeContext';
import { fetchLoggedInUser } from './services/apiService';

// Page Components
import HomePage from './pages/HomePage';
import ChatRoomPage from './pages/ChatRoomPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Utility Components
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Logout from './components/Logout';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

import './index.css';

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const AppContent = () => {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');
        const data = await fetchLoggedInUser();
        console.log('User data fetched:', data);
        setUserId(data?.userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <ErrorBoundary>
      <div className={`app ${theme}`}>
        {!isAuthPage && <Header />}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/chat-room"
              element={
                <PrivateRoute>
                  <ChatRoomPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : userId ? (
                    <UserProfilePage userId={userId} />
                  ) : (
                    <div>Error: User ID not found</div>
                  )}
                </PrivateRoute>
              }
            />
            <Route path="/logout" element={<Logout />} />

            {/* Fallback Route */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;