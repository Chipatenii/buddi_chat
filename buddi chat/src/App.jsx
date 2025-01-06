import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
import Logout from './components/Logout';

const App = () => {
  return (
    <Router>
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
    </Router>
  );
};

export default App;
