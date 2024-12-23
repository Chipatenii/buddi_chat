import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold text-blue">Welcome to Buddi Chat</h1>
        <p className="mt-4 text-lg text-gray-700">
          Start chatting with your friends in real time!
        </p>
        <button className="mt-6 bg-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
          Join Chat Room
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
