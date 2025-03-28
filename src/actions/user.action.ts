import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = "https://twitter-backend-lac-one.vercel.app/api/users";

export interface User {
    id: string;
    email: string;
    username: string;
    full_name: string;
    profile_picture?: string;
    provider?: string;
    bio: string;
    followers_count: number;
    following_count: number;
}

interface UpdateProfilePayload {
  full_name: string;
  username: string;
  bio: string;
  profile_picture?: string;
}

export interface SocialLoginData {
  email: string;
  full_name: string;
  username: string;
  profile_picture?: string;
  provider: string;
}

export interface SocialLoginResponse {
  message: string;
  user: User;
}

export interface ApiResponse<T> {
  message: string;
  user?: User;
  data: T | null;
  error?: string;
  token?: string;
  followingCount?: number;
  followersCount?: number;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  full_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface FollowPayload {
  followingId: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get("token");
        if (token && config.headers) {
          config.headers["Authorization"] = token;
        }
        config.headers["Content-Type"] = "application/json";
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public setToken(token: string) {
    Cookies.set("token", token, { sameSite: "Lax", secure: false });
  }

  public clearToken() {
    Cookies.remove("token");
  }

  private handleError<T>(error: unknown, message: string): ApiResponse<T> {
    const axiosError = error as AxiosError;
    return {
      message,
      data: null,
      error: (axiosError.response?.data as { error?: string })?.error || axiosError.message || "Unknown error",
    };
  }

  public async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get("/all");
      return response.data;
    } catch (error) {
      return this.handleError<User[]>(error, "Failed to get users");
    }
  }

  public async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post("/register", payload);
      return response.data;
    } catch (error) {
      return this.handleError<User>(error, "Registration failed");
    }
  }

  public async login(payload: LoginPayload): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post("/login", payload);
      return response.data;
    } catch (error) {
      return this.handleError<User>(error, "Login failed");
    }
  }

  public async logout(): Promise<ApiResponse<null>> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await this.api.post("/logout");
      this.clearToken();
      return response.data;
    } catch (error) {
      return this.handleError<null>(error, "Logout failed");
    }
  }

  public async socialLogin(userData: SocialLoginData): Promise<ApiResponse<SocialLoginResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<SocialLoginResponse>> = await this.api.post("/social-login", userData);
      return response.data;
    } catch (error) {
      return this.handleError<SocialLoginResponse>(error, "Social login failed");
    }
  }

  public async getRecommendedUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get("/recommended");
      return response.data;
    } catch (error) {
      return this.handleError<User[]>(error, "Failed to get recommended users");
    }
  }

  public async getUser(): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.get("/me");
      return response.data;
    } catch (error) {
      return this.handleError<User>(error, "Failed to get user data");
    }
  }

  public async followUser(payload: FollowPayload): Promise<ApiResponse<null>> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await this.api.post("/follow", payload);
      return response.data;
    } catch (error) {
      return this.handleError<null>(error, "Failed to follow user");
    }
  }

  public async getUserFollowed(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get("/userFollowed");
      return response.data;
    } catch (error) {
      return this.handleError<User[]>(error, "Failed to get followed users");
    }
  }

  public async unfollowUser(payload: FollowPayload): Promise<ApiResponse<null>> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await this.api.post("/unfollow", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return this.handleError<null>(error, "Failed to unfollow user");
    }
  }

  public async getFollowingCount(): Promise<ApiResponse<number>> {
    try {
      const response: AxiosResponse<ApiResponse<number>> = await this.api.get(`/following-count`);
      return response.data;
    } catch (error) {
      return this.handleError<number>(error, "Failed to get following count");
    }
  }

  public async getFollowersCount(): Promise<ApiResponse<number>> {
    try {
      const response: AxiosResponse<ApiResponse<number>> = await this.api.get(`/followers-count`);
      return response.data;
    } catch (error) {
      return this.handleError<number>(error, "Failed to get followers count");
    }
  }

  public async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    try {
      const formData = new FormData();
      formData.append("full_name", payload.full_name);
      formData.append("username", payload.username);
      formData.append("bio", payload.bio || '');

      if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
      }

      const token = Cookies.get("token");

      const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": token,
        },
      });

      return response.data;
    } catch (error) {
      return this.handleError<User>(error, "Profile update failed");
    }
  }
}

const authService = new AuthService();
export default authService;
