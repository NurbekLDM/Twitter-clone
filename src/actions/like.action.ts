import Axios from 'axios';

const API_URL = 'https://api.com';

export const likePost = async (postId: number) => {
    try {
        const response = await Axios.put(`${API_URL}/posts/${postId}/like`);
        return response.data;
    } catch (error) {
        console.error('Error liking post', error);
    }
}

export const unlikePost = async (postId: number) => {
    try {
        const response = await Axios.put(`${API_URL}/posts/${postId}/unlike`);
        return response.data;
    } catch (error) {
        console.error('Error unliking post', error);
    }
}