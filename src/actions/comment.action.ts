import Axios from "axios";

const API_URL = 'https://api.com';

export const fetchComments = async (postId: number) => {
    try {
        const response = await Axios.get(`${API_URL}/posts/${postId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments', error);
    }
}

export const createComment = async (postId: number, data: any) => {
    try {
        const response = await Axios.post(`${API_URL}/posts/${postId}/comments`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating comment', error);
    }
}

export const updateComment = async (postId: number, commentId: number, data: any) => {
    try {
        const response = await Axios.put(`${API_URL}/posts/${postId}/comments/${commentId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating comment', error);
    }
}

export const deleteComment = async (postId: number, commentId: number) => {
    try {
        const response = await Axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting comment', error);
    }
}