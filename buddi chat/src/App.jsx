import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import useAuth from './hooks/useAuth';
import useOnlineStatus from './hooks/useOnlineStatus';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';
import OfflineBanner from './components/OfflineBanner';
import SessionTimeoutModal from './components/SessionTimeoutModal';
import Header from './components/Header';
import Footer from './components/Footer';
import logger from './utils/logger';
import './index.css';

// Code-split components
const HomePage = lazy(() => import('./pages/HomePage'));
const ChatRoomPage = lazy(() => import('./pages/ChatRoomPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

const AppContent = () => {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { user, loading, error, logout } = useAuth();
  const isOnline = useOnlineStatus();
  const { isIdle, remaining } = useIdleTimer(300000, logout);

  if (loading) return <Loader fullScreen />;

  return (
    <div className={`app ${theme}`}>
      {!isOnline && <OfflineBanner />}
      {isIdle && <SessionTimeoutModal remaining={remaining} onStay={logout} />}
      
      <Header user={user} />
      
      <main className="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={
              <RouteErrorBoundary>
                <HomePage user={user} />
              </RouteErrorBoundary>
            } />
            
            <Route path="/login" element={
              <RouteErrorBoundary>
                <LoginPage />
              </RouteErrorBoundary>
            } />
            
            <Route element={<PrivateRoute user={user} />}>
              <Route path="/chat-room" element={
                <RouteErrorBoundary>
                  <ChatRoomPage />
                </RouteErrorBoundary>
              } />
            </Route>
            
            {/* Add similar error boundaries to all routes */}
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;