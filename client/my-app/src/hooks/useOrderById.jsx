import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useOrderById(orderId) {
  return useQuery({
    queryKey: ["orders", "byId", orderId],
    queryFn: async () => {
      const res = await fetch(apiUrl(`orders/${orderId}`));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load order");
      }
      return data?.data || null; // { order }
    },
    enabled: !!orderId,
    staleTime: 2 * 60 * 1000,
  });
}