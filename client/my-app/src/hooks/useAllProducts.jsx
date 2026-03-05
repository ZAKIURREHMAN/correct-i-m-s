import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useAllProducts() {
  return useQuery({
    queryKey: ["products", "list"],
    queryFn: async () => {
      const res = await fetch(apiUrl("products/"));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load products");
      }
      // API returns { status, message, getAllProduct: products[] }
      return Array.isArray(data?.getAllProduct) ? data.getAllProduct : [];
    },
    staleTime: 5 * 60 * 1000,
  });
}