import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatRoomPage from './pages/ChatRoomPage';
import SettingsPage from './pages/SettingsPage';
import UserProfilePage from './pages/UserProfilePage';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat-room" element={<ChatRoomPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
