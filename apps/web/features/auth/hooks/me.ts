import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/auth.service";
import { AUTH_KEY } from "../services/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: AUTH_KEY,
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_KEY, data);
    },
  });
};
