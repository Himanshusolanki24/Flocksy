import { http } from "./http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";

export const authService = {
  /** Exchange credentials for a JWT + user. */
  login(payload: LoginRequest): Promise<AuthResponse> {
    return http.post<AuthResponse>("/auth/login", payload);
  },

  /** Register a new farmer account. */
  register(payload: RegisterRequest): Promise<AuthResponse> {
    return http.post<AuthResponse>("/auth/register", payload);
  },

  /** Fetch the currently authenticated user's profile. */
  async getProfile(): Promise<User> {
    const data = await http.get<{ user: User }>("/users/profile");
    return data.user;
  },
};