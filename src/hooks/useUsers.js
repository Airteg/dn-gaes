import { useQuery } from "@tanstack/react-query";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const useUsers = ({ filter = "", showDeleted = false, page = 1 }) =>
  useQuery({
    queryKey: ["users", { filter, showDeleted, page }],
    queryFn: async () => {
      return await fetchWithAuth(
        `/api/admin/users?filter=${encodeURIComponent(filter)}&showDeleted=${showDeleted}&page=${page}`,
      );
    },
    staleTime: 1000 * 60, // 1 хвилина кешу
    retry: false, // не повторювати запити при 401/403
  });
