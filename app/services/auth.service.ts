import { ApiClient } from "./api-client";

interface SignUpData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/signup", data);
    return response.data;
  }

  static async login(data: SignUpData): Promise<AuthResponse> {
    const response = await ApiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  }
}
