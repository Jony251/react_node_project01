import React, { useState, useEffect } from 'react';
import './Home.css';
import { getPageContent } from '../../services/pageContentService';

/**
 * The Home component serves as the main entry point of the application,
 * providing an overview of its features and guiding users on how to get started
 * 
 * It is composed of two main sections: a list of key features and a
 * brief guide on getting started with the application
 * @returns {JSX.Element} Home component
 */
const Home = () => {
    const [homeContent, setHomeContent] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            const content = await getPageContent('home_page');
            setHomeContent(content);
        };
        fetchContent();
    }, []);

    return (
        <div className="home-container" 
             dangerouslySetInnerHTML={{ __html: homeContent }} />
    );
}
export default Home;
