import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to Buddi Chat</h1>
      <p className="text-gray-600">Start chatting with your friends in real time!</p>
      <Link
        to="/chat-room"
        className="mt-4 bg-blue text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Join Chat Room
      </Link>
    </div>
  );
};

export default HomePage;
