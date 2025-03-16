import Axios from 'axios';

export const fetchUser = async (username: string) => {
    try {
        const response = await Axios.get(`https://api.example.com/users/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user', error);
    }
}

export const updateUser = async (username: string, data: any) => {
    try {
        const response = await Axios.put(`https://api.example.com/users/${username}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating user', error);
    }
}

