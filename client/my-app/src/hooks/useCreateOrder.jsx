import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useCreateOrder() {
  return useMutation({
    mutationFn: async ({ customerId, totalPrice }) => {
      const res = await fetch(apiUrl("orders/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, totalPrice }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create order");
      }
      // Returns { status, message, data: order }
      return data;
    },
  });
}