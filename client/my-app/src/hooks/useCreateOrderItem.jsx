import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useCreateOrderItem() {
  return useMutation({
    mutationFn: async ({ orderId, productId, customerId, customizePrise, quantity, subTotal }) => {
      const res = await fetch(apiUrl("order-items/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, productId, customerId, customizePrise, quantity, subTotal }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to create order item");
      }
      return data; // { status, message, data: orderItem }
    },
  });
}