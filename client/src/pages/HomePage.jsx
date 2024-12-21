import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage = () => {
    return (
        <div>
            <Header />
            <main>
                <h2>Welcome to Buddi Chat</h2>
                <p>Connect and chat in real-time!</p>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
