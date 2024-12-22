import React from 'react';
import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <h2>Welcome to Buddi Chat!</h2>
        <p>Join chat rooms, connect with people, and exchange messages in real-time.</p>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
