import axios from 'axios';

const API_URL = 'http://localhost:3000/api/page-content';

export const getPageContent = async (section) => {
    try {
        const response = await axios.get(`${API_URL}/${section}`);
        return response.data.content;
    } catch (error) {
        console.error('Error fetching page content:', error);
        return '';
    }
};

//TODO: implement updatePageContent for the future needs 
export const updatePageContent = async (section, content) => {
    try {
        await axios.put(`${API_URL}/${section}`, { content });
        return true;
    } catch (error) {
        console.error('Error updating page content:', error);
        return false;
    }
};
