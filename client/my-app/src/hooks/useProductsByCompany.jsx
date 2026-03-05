import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useProductsByCompany(companyId) {
  return useQuery({
    queryKey: ["products", "byCompany", companyId],
    queryFn: async () => {
      const res = await fetch(apiUrl(`products/by-company/${companyId}`));
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to load products");
      }
      // API returns { status, message, data: products }
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
}