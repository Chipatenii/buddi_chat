import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Page Components
import HomePage from './pages/HomePage';
import ChatRoomPage from './pages/ChatRoomPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Utility Components
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();  // Now inside the Router context

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';  // Check if it's the Register or Login page

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Conditionally render the Header and Footer */}
        {!isAuthPage && <Header />}
        
        {/* Main Content */}
        <div className="main-content">
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
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfilePage />
                </PrivateRoute>
              }
            />
            <Route path="/logout" element={<Logout />} />

            {/* Fallback Route for Unmatched Paths */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>

        {/* Conditionally render the Footer */}
        {!isAuthPage && <Footer />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
