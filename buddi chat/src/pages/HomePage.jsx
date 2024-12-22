import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <header>
        <h1>Welcome to Buddi Chat</h1>
      </header>
      <main>
        <p>Join a chat room and start connecting with your friends instantly!</p>
        <div>
          <Link to="/chat-room">Go to Chat Room</Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
