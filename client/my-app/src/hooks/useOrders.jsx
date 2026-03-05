import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useOrders() {
  return useQuery({
    queryKey: ["orders", "list"],
    queryFn: async () => {
      const res = await fetch(apiUrl("orders/"));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load orders");
      }
      // API returns { status, message, data: orders[] }
      const orders = Array.isArray(data?.data) ? data.data : [];
      return orders;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnMount: "always",
  });
}