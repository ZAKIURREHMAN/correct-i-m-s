import { apiUrl } from "../lib/api";

export default function useUpdateCompany() {
  const updateCompany = async ({ id, name, address, number, email }) => {
    const res = await fetch(apiUrl(`company/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, number, email }),
    });
    const data = await res.json() 
    if (!res.ok) {
      throw new Error(data?.message || 'Failed to update company');
    }
    return data;
  };

  return { updateCompany };
}