import React from "react";
import { apiUrl } from "../lib/api";

function useCreateSupplier() {
  const createSupplier = async ({ companyId, name, address, number, email }) => {
    const response = await fetch(apiUrl(`company/suppliers/${companyId}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, number, email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to create supplier");
    }
    return data;
  };

  return { createSupplier };
}

export default useCreateSupplier;