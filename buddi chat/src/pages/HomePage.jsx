import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  const navigate = useNavigate();

  // Navigate to the Chat Room
  const handleJoinChatRoom = () => {
    navigate('/chat-room');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow-1 container p-5 text-center">
        <h1 className="display-4 fw-bold text-primary">Welcome to Buddi Chat</h1>
        <p className="mt-4 fs-5 text-muted">
          Start chatting with your friends in real time!
        </p>
        <button
          className="mt-4 btn btn-warning"
          onClick={handleJoinChatRoom}
        >
          Join Chat Room
        </button>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default HomePage;