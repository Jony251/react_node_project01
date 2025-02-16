import React from 'react';
import './Home.css';

/**
 * The Home component serves as the main entry point of the application, providing an overview of its features and guiding users on how to get started.
 * It is composed of two main sections: a list of key features and a brief guide on getting started with the application.
 * @returns {JSX.Element} The Home component.
 */
const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Game Management System</h1>
            <div className="content">
                <section className="features">
                    <h2>Features</h2>
                    <ul>
                        <li>Browse and discover games</li>
                        <li>Manage your game collection</li>
                        <li>Upload and edit game details</li>
                        <li>Secure authentication system</li>
                    </ul>
                </section>
                <section className="getting-started">
                    <h2>Getting Started</h2>
                    <p>
                        Browse our collection of games or manage your own listings.
                        Use the navigation menu above to explore different sections of the application.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Home;
