import { apiUrl } from "../lib/api";

export default function useDeleteCompany() {
  const deleteCompany = async (id) => {
    const res = await fetch(apiUrl(`company/${id}`), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.message || "Failed to delete company");
    }
    return data;
  };

  return { deleteCompany };
}