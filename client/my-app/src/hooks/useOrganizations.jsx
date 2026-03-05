import { useState } from "react";
import { apiUrl } from "../lib/api";

function useOrganizations() {
  const getOrganizations = async () => {
    const res = await fetch(apiUrl("company/organizations"), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.message || "Failed to load organizations");
    }
    return data.companies; 
  };


  return { getOrganizations };
}
export default useOrganizations;
