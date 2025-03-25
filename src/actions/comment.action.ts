import axios, { AxiosError, AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://twitter-backend-lac-one.vercel.app/api/comments';

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  text: string;
  date: string;
  users?: {
    username: string;
    profile_picture?: string;
  };
  comment_likes?: { count: number }[];
}

interface ApiResponse<T> {
  data?: T;
  message: string;
  error?: string;
}

interface CommentPayload {
  post_id: string;
  text: string;
  user_id: string;
}

class CommentService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get("token");
        if (token && config.headers) {
          config.headers['Authorization'] = token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public async createComment(payload: CommentPayload): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.api.post<ApiResponse<Comment>>('/create', payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while creating comment',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }

  public async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    try {
      const response = await this.api.get<ApiResponse<Comment[]>>(`/all/${postId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while fetching comments',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }

  public async updateComment(commentId: string, payload: CommentPayload): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.api.put<ApiResponse<Comment>>(`/update/${commentId}`, payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while updating comment',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }

  public async deleteComment(commentId: string): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.api.delete<ApiResponse<Comment>>(`/delete/${commentId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while deleting comment',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }

  public async likeComment(commentId: string): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.api.post<ApiResponse<Comment>>(`/${commentId}/like`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while liking comment',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }

  public async unlikeComment(commentId: string): Promise<ApiResponse<Comment>> {
    try {
      const response = await this.api.delete<ApiResponse<Comment>>(`/${commentId}/unlike`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while unliking comment',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }

  public async getUserLikedComments(): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.api.get<ApiResponse<string[]>>('/userLikedComments');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      return {
        message: 'An error occurred while fetching liked comments',
        error: axiosError.response?.data?.error || 'Unknown error',
      };
    }
  }
}

const commentService = new CommentService();
export default commentService;