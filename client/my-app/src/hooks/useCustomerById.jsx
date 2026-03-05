import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useCustomerById(customerId) {
  return useQuery({
    queryKey: ["customers", "byId", customerId],
    queryFn: async () => {
      const res = await fetch(apiUrl(`customers/${customerId}`));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load customer");
      }
      return data?.data || null;
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000,
  });
}