import { useQuery } from "@tanstack/react-query";
import fetchWithAuth from "@/utils/fetchWithAuth";

export const useDocuments = () =>
  useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      return await fetchWithAuth("/api/documents");
    },
    staleTime: 1000 * 60, // 1 хвилина
    retry: false,
  });
