import React from "react";
import { apiUrl } from "../lib/api";

function useCreateProduct() {
  const createProduct = async (payload) => {
    const { name, warranty, buyPrice, sellingPrice, quantity, alert,supplierId } = payload;

    const response = await fetch(apiUrl(`products/create/${supplierId}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        warranty,
        buyPrice,
        sellingPrice,
        quantity,
        alert,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Failed to create product");
    }
    return data;
  };

  return { createProduct };
}

export default useCreateProduct;
