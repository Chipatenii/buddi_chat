import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-blue-500 text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Buddi Chat</h1>
      <p className="text-lg mb-6">Start chatting with your friends in real time!</p>
      <div className="space-x-4">
        <Link to="/chat-room" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Go to Chat Room
        </Link>
        <Link to="/login" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
