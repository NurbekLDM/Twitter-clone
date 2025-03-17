import axios from 'axios';

export const fetchSaved = async (username: string) => {
    try {
        const response = await axios.get(`https://api.example.com/saved/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching saved', error);
    }
}

export const savePost = async (username: string, postId: string) => {
    try {
        const response = await axios.post(`https://api.example.com/saved/${username}`, { postId });
        return response.data;
    } catch (error) {
        console.error('Error saving post', error);
    }
}

export const unsavePost = async (username: string, postId: string) => {
    try {
        const response = await axios.delete(`https://api.example.com/saved/${username}/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error unsaving post', error);
    }
}