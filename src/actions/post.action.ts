import axios, { AxiosInstance, AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = 'https://twitter-backend-lac-one.vercel.app/api/posts';

export interface Post {
    id: string;
    user_id: string;
    image: string;
    text: string;
    likes: number;
    date: string;
}

interface ApiResponse<T> {
    data: T | null;
    message: string;
    error?: string;
}

interface PostPayload {
    image: string;
    text: string;
}

class PostService {
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
                    config.headers["Authorization"] = token;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    public async createPost(formData: FormData): Promise<ApiResponse<Post>> {
        try {
            const token = Cookies.get("token");
            const response = await this.api.post<ApiResponse<Post>>('/create', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": token,
                },
            });
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, "An error occurred while creating the post");
        }
    }

    public async getPosts(): Promise<ApiResponse<Post[]>> {
        try {
            const response = await this.api.get<ApiResponse<Post[]>>('/');
            return response.data;
        } catch (error) {
            return this.handleError<Post[]>(error, 'An error occurred while fetching posts');
        }
    }

    public async getPost(id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await this.api.get<ApiResponse<Post>>(`/${id}`);
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, 'An error occurred while fetching post');
        }
    }

    public async deletePost(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await this.api.delete<ApiResponse<null>>(`/delete/${id}`);
            return response.data;
        } catch (error) {
            return this.handleError<null>(error, 'An error occurred while deleting post');
        }
    }

    public async getUserLikedPosts(): Promise<ApiResponse<{ user_id: string }[]>> {
        try {
            const response = await this.api.get<ApiResponse<{ user_id: string }[]>>('/likedPosts');
            return response.data;
        } catch (error) {
            return this.handleError<{ user_id: string }[]>(error, "An error occurred while fetching liked posts");
        }
    }

    public async getUserBookmarkedPosts(): Promise<ApiResponse<[]>> {
        try {
            const response = await this.api.get<ApiResponse<{ user_id: string }[]>>('/bookmarkedPosts');
           
            return response.data;
        } catch (error) {
            return this.handleError<{ user_id: string }[]>(error, "An error occurred while fetching bookmarked posts");
        }
    }

    public async updatePost(id: string, payload: PostPayload): Promise<ApiResponse<Post>> {
        try {
            const response = await this.api.put<ApiResponse<Post>>(`/update/${id}`, payload);
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, 'An error occurred while updating post');
        }
    }

    public async likePost(id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await this.api.post<ApiResponse<Post>>(`/${id}/like`);
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, 'An error occurred while liking post');
        }
    }

    public async unlikePost(id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await this.api.delete<ApiResponse<Post>>(`/${id}/unlike`);
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, 'An error occurred while unliking post');
        }
    }

    public async addBookmark(id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await this.api.post<ApiResponse<Post>>(`/${id}/bookmark`);
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, 'An error occurred while adding bookmark');
        }
    }

    public async removeBookmark(id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await this.api.delete<ApiResponse<Post>>(`/${id}/unbookmark`);
            return response.data;
        } catch (error) {
            return this.handleError<Post>(error, 'An error occurred while removing bookmark');
        }
    }

    public async getBookmarks(userId: string): Promise<ApiResponse<Post[]>> {
        try {
            const response = await this.api.get<ApiResponse<Post[]>>(`/user/${userId}`);
            return response.data;
        } catch (error) {
            return this.handleError<Post[]>(error, 'An error occurred while fetching bookmarks');
        }
    }

    public async getUserPosts(): Promise<ApiResponse<Post[]>> {
        try {
            const token = Cookies.get("token");
            const response = await this.api.get<ApiResponse<Post[]>>('/userPost', {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            return this.handleError<Post[]>(error, 'An error occurred while fetching user posts');
        }
    }

    private handleError<T>(error: unknown, message: string): ApiResponse<T> {  
        const axiosError = error as AxiosError;
        return {
            message,
            data: null,
            error: (axiosError.response?.data as { error?: string })?.error || axiosError.message || "Unknown error",
        };
    }
}

const postService = new PostService();
export default postService;