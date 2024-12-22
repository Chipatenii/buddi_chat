import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoomPage from './pages/ChatRoomPage';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/chatroom" element={<ChatRoomPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
