import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
    return (
        <div>
            <Header />
            <main>
                <h2>Your Profile</h2>
                <p>Edit your profile details here.</p>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;
