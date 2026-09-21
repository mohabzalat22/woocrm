import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../services/auth.service";
import { LoginRespone } from "../types/login.response.interface";
import { AUTH_KEY } from "../services/auth.service";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: LoginRespone) => {
      queryClient.setQueryData(AUTH_KEY, data.user);
      router.push("/dashboard");
    },
  });
};
