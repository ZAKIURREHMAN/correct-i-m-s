import { apiUrl } from "../lib/api";

function useCreateCustomer() {
  const createCustomer = async ({ name, email, number, address }) => {
    const response = await fetch(apiUrl("customers/create"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, number, address }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to create customer");
    }

    return data;
  };

  return { createCustomer };
}

export default useCreateCustomer;