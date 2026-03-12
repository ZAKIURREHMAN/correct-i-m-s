import { useMutation } from "@tanstack/react-query";
import { apiUrl } from "../lib/api";

export default function useCreateOrder() {
  return useMutation({
    mutationFn: async ({ customerId, totalPrice, paidAmount = 0 }) => {
      // Validate inputs
      if (!customerId || !totalPrice) {
        throw new Error("Customer ID and total price are required");
      }

      const res = await fetch(apiUrl("orders/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerId: Number(customerId), 
          totalPrice: Number(totalPrice),
          paidAmount: Number(paidAmount) || 0
        }),
      });
      
      const data = await res.json().catch(() => {
        throw new Error("Invalid server response");
      });
      
      if (!res.ok) {
        throw new Error(data?.message || `Failed to create order (HTTP ${res.status})`);
      }
      
      // Validate response structure
      if (!data || !data.data) {
        throw new Error("Invalid response format from server");
      }
      
      // Returns { status, message, data: order, existingOrder }
      return data;
    },
  });
}