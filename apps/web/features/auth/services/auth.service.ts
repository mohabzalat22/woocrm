import { request } from "@/common/lib/api";
import { LoginPayload } from "../types/login.interface";
import { RegisterPayload } from "../types/register.interface";
import { LoginRespone } from "../types/login.response.interface";
import { CurrentUser } from "../types/current-user.interface";
import { UpdateMePayload } from "../types/update-me.interface";

export const AUTH_KEY = ["currentUser"] as const;

export const authApi = {
  login: (data: LoginPayload): Promise<LoginRespone> =>
    request("auth/login", { method: "POST", body: JSON.stringify(data) }),

  register: (data: RegisterPayload): Promise<LoginRespone> =>
    request("auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (): Promise<void> => request("auth/logout", { method: "POST" }),

  me: (): Promise<CurrentUser> => request("users/me", { method: "GET" }),

  updateMe: (data: UpdateMePayload): Promise<CurrentUser> =>
    request("users/me", { method: "PATCH", body: JSON.stringify(data) }),
};
