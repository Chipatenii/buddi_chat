import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1 className="display-4 fw-bold mb-4">Welcome to Buddi Chat</h1>
      <p className="text-muted">Start chatting with your friends in real time!</p>
      <Link
        to="/chat-room"
        className="mt-4 btn btn-primary"
      >
        Join Chat Room
      </Link>
    </div>
  );
};

export default HomePage;