/* eslint-disable @typescript-eslint/no-empty-object-type */
import axios from 'axios';
import Cookies from 'js-cookie';
import { AxiosInstance } from 'axios';

const API_URL = 'https://twitter-backend-lac-one.vercel.app/api/comments';

interface Comment {
    id: string;
    user_id: string;
    post_id: string;
    text: string;
    created_at: string;
    likes: number;
}

interface ApiResponse<T> {
      
    data?: ApiResponse<Comment[]>;
    message: string;
    comment?: T;
    error?: string;
}

interface CommentPayload {
    post_id: string;
    comment: string;
    user_id: string;
}

class CommentService {
    private api: AxiosInstance;
    private baseUrl: string = API_URL;
    private token: string | null = null;

    constructor() {
        this.api = axios.create({
            baseURL: this.baseUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use(
            (config) => {
                const token = Cookies.get("token");
                if (token && config.headers) {
                    config.headers['Authorization'] = token
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    public setToken(token: string) {
        this.token = token;
    }

    public async createComment(payload: CommentPayload): Promise<ApiResponse<Comment>> {
        try {
            const response = await this.api.post<ApiResponse<Comment>>('/create', payload);
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while creating comment',
                error: (error as any).response.data.error,
            };
        }
    }

   public async likeComment(commentId: string): Promise<ApiResponse<Comment>> {
        try {
            const response = await this.api.post<ApiResponse<Comment>>(`/${commentId}/like`);
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while liking comment',

                error: (error as any).response.data.error,
            };
        }
   } 

   public async unlikeComment(commentId: string): Promise<ApiResponse<Comment>> {
        try {
            const response = await this.api.delete<ApiResponse<Comment>>(`/${commentId}/unlike`);
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while unliking comment',

                error: (error as any).response.data.error,
            };
   }
}

public async getUserLikedComments(): Promise<ApiResponse<Comment[]>> {
        try {
            const response = await this.api.get<ApiResponse<Comment[]>>('/userLikedComments');
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while fetching liked comments',

                error: (error as any).response?.data?.error || 'Unknown error',
            };
        }
}

    public async deleteComment(commentId: string): Promise<ApiResponse<Comment>> {
        try {
            const response = await this.api.delete<ApiResponse<Comment>>(`/delete/${commentId}`);
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while deleting comment',

                error: (error as any).response.data.error,
            };
        }
    }

    public async updateComment(commentId: string, payload: CommentPayload): Promise<ApiResponse<Comment>> {
        try {
            const response = await this.api.put<ApiResponse<Comment>>(`/update/${commentId}`, payload);
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while updating comment',

                error: (error as any).response.data.error,
            };
        }
    }

    public async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
        try {
            const response = await this.api.get<ApiResponse<Comment[]>>(`/all/${postId}`);
            return response.data;
        } catch (error) {
            return {
                message: 'An error occurred while fetching comments',

                error: (error as any).response.data.error,
            };
        }
    }



}

const commentService = new CommentService();
export default commentService;