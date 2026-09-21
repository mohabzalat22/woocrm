import { request } from "@/common/lib/api";
import { LoginPayload } from "../types/login.interface";
import { RegisterPayload } from "../types/register.interface";
import { LoginRespone } from "../types/login.response.interface";
import { CurrentUser } from "../types/current-user.interface";

export const AUTH_KEY = ["currentUser"] as const;

export const authApi = {
  login: (data: LoginPayload): Promise<LoginRespone> =>
    request("auth/login", { method: "POST", body: JSON.stringify(data) }),

  register: (data: RegisterPayload): Promise<CurrentUser> =>
    request("auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (): Promise<CurrentUser> =>
    request("auth/logout", { method: "POST" }),

  me: (): Promise<CurrentUser> => request("/api/auth/me", { method: "GET" }),

  updateMe: (): Promise<CurrentUser> => request("auth/me", { method: "PATCH" }),
};
