import Axios  from "axios";

const API_URL = 'https://api.com';
export const fetchPosts = async () => {
    try {
        const response = await Axios.get(`${API_URL}/posts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts', error);
    }
}

export const fetchPost = async (id: number) => {
    try {
        const response = await Axios.get(`${API_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post', error);
    }
}

export const createPost = async (data: any) => {
    try {
        const response = await Axios.post(`${API_URL}`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating post', error);
    }
}

export const updatePost = async (id: number, data: any) => {
    try {
        const response = await Axios.put(`${API_URL}/posts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating post', error);
    }
}

export const deletePost = async (id: number) => {
    try {
        const response = await Axios.delete(`${API_URL}/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting post', error);
    }
}

export const savePost = async (id: number) => {
    try {
        const response = await Axios.post(`${API_URL}/posts/${id}/save`);
        return response.data;
    } catch (error) {
        console.error('Error saving post', error);
    }
}

export const unsavePost = async (id: number) => {
    try {
        const response = await Axios.delete(`${API_URL}/posts/${id}/unsave`);
        return response.data;
    } catch (error) {
        console.error('Error unsaving post', error);
    }
}

export const repostPost = async (id: number) => {
    try {
        const response = await Axios.post(`${API_URL}/posts/${id}/repost`);
        return response.data;
    } catch (error) {
        console.error('Error reposting post', error);
    }
}

export const unrepostPost = async (id: number) => {
    try {
        const response = await Axios.delete(`${API_URL}/posts/${id}/unrepost`);
        return response.data;
    } catch (error) {
        console.error('Error unreposting post', error);
    }
}