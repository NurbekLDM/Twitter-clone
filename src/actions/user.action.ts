import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
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
  user?: T;
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
  private baseUrl: string = API_URL;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true, // Required for cookies
    });

    // Interceptor to attach token to requests
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get("token");
        console.log("Token:", token);
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        config.headers["Content-Type"] = "application/json";
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public async setToken(token: string) {
    Cookies.set("token", token, { sameSite: "Lax", secure: false });
  }

  public async clearToken() {
    Cookies.remove("token");
  }

  public async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get("/all");
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to get users");
    }
  }

  public async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post("/register", payload);
      return response.data;
    } catch (error) {
      return this.handleError(error, "Registration failed");
    }
  }

  public async login(payload: LoginPayload): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post("/login", payload);
      return response.data;
    } catch (error) {
      return this.handleError(error, "Login failed");
    }
  }

  public async logout(): Promise<ApiResponse<null>> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await this.api.post("/logout");
      this.clearToken();
      return response.data;
    } catch (error) {
      return this.handleError(error, "Logout failed");
    }
  }

  public async socialLogin(userData: SocialLoginData): Promise<SocialLoginResponse> {
    try {
      const response = await this.api.post<SocialLoginResponse>("/social-login", userData);
      return response.data;
    } catch (error) {
      console.error("Social login error:", error);
      return {
        message: "Social login failed",
        user: {} as User // Provide a default empty user object
      };
    }
  }

  public async getRecommendedUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get("/recommended");
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to get recommended users");
    }
  }

  public async getUser(): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.get("/me");
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to get user data");
    }
  }

  public async followUser(payload: FollowPayload): Promise<ApiResponse<unknown>> {
    try {
      const response: AxiosResponse<ApiResponse<unknown>> = await this.api.post("/follow", payload);
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to follow user");
    }
  }

  public async unfollowUser(payload: FollowPayload): Promise<ApiResponse<unknown>> {
    try {
      const response: AxiosResponse<ApiResponse<unknown>> = await this.api.post("/unfollow", payload);
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to unfollow user");
    }
  }

  public async getFollowingCount(): Promise<ApiResponse<number>> {
    try {
      const response: AxiosResponse<ApiResponse<number>> = await this.api.get("/following-count");
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to get following count");
    }
  }

  public async getFollowersCount(): Promise<ApiResponse<number>> {
    try {
      const response: AxiosResponse<ApiResponse<number>> = await this.api.get("/followers-count");
      return response.data;
    } catch (error) {
      return this.handleError(error, "Failed to get followers count");
    }
  }

  public async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    try {
      const formData = new FormData();
      formData.append("full_name", payload.full_name);
      formData.append("username", payload.username);
      formData.append("bio", payload.bio || '');

      if (payload.profile_picture) {
        formData.append("profile", payload.profile_picture);
        console.log("Payload profile picture:", payload.profile_picture);
      }

      console.log("Form data:", formData);
      for (const el of formData.entries()) {
        console.log(el[0], el[1]);
      }

      const token = Cookies.get("token");

      const response: AxiosResponse<ApiResponse<User>> = await this.api.put(
        `/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return this.handleError(error, "Profile update failed");
    }
  }

  private handleError(error: unknown, message: string): ApiResponse<never> {
    const axiosError = error as AxiosError;
    return {
      message,
      error: axiosError.response && axiosError.response.data && typeof axiosError.response.data === 'object' && 'error' in axiosError.response.data ? String(axiosError.response.data.error) : axiosError.message || "Unknown error",
    };
  }
}

const authService = new AuthService();
export default authService;
