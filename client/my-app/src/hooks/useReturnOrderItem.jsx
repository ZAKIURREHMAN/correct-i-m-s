import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useReturnOrderItem() {
  return useMutation({
    mutationFn: async ({ orderItemId, returnQuantity }) => {
      const res = await fetch(apiUrl("order-items/return"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId, returnQuantity }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to process return");
      }
      return data; // { status, message, data: updatedItem, refundAmount, stock }
    },
  });
}