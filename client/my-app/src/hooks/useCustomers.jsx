import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useCustomers() {
  return useQuery({
    queryKey: ["customers", "list"],
    queryFn: async () => {
      const res = await fetch(apiUrl("customers/"));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load customers");
      }
      // API returns { status, message, data: customers[] }
      return Array.isArray(data?.data) ? data.data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
}