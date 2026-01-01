import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import useOnlineStatus from './hooks/useOnlineStatus';
import useIdleTimer from './hooks/useIdleTimer';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import PrivateRoute from './components/PrivateRoute';
import { Loader } from './components/ui';
import OfflineBanner from './components/OfflineBanner';
import SessionTimeoutModal from './components/SessionTimeoutModal';
import AppShell from './components/AppShell';
import { AnimatePresence } from 'framer-motion';
import './index.css';

// Code-split components
const HomePage = lazy(() => import('./pages/HomePage'));
const ChatRoomPage = lazy(() => import('./pages/ChatRoomPage'));
const AuthScreen = lazy(() => import('./pages/AuthScreen'));

const APP_ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  CHAT: '/chat-room',
  PROFILE: '/profile/:userId',
  SETTINGS: '/settings',
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

const AppContent = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user, loading, logout } = useAuth();
  const isOnline = useOnlineStatus();
  const { isIdle, remaining } = useIdleTimer(300000, logout);

  if (loading) return <Loader fullScreen />;

  return (
    <div className={`app-container ${theme}`} data-theme={theme}>
      {!isOnline && <OfflineBanner />}
      {isIdle && <SessionTimeoutModal remaining={remaining} onStay={logout} />}
      
      <Suspense fallback={<Loader fullScreen />}>
        <AnimatePresence mode="wait">
          {!user ? (
            <Routes location={location} key="auth-routes">
              <Route path={APP_ROUTES.AUTH} element={<AuthScreen />} />
              {/* Redirect legacy auth routes */}
              <Route path="/login" element={<Navigate to={APP_ROUTES.AUTH} replace />} />
              <Route path="/register" element={<Navigate to={APP_ROUTES.AUTH} replace />} />
              <Route path="*" element={<Navigate to={APP_ROUTES.AUTH} replace />} />
            </Routes>
          ) : (
            <AppShell user={user}>
              <Routes location={location} key="app-routes">
                <Route path={APP_ROUTES.HOME} element={<HomePage user={user} />} />
                <Route path={APP_ROUTES.CHAT} element={<ChatRoomPage />} />
                <Route path={APP_ROUTES.PROFILE} element={<UserProfilePage />} />
                <Route path={APP_ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
              </Routes>
            </AppShell>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default App;
