import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../lib/api";

function useCompany() {
  const navigate = useNavigate();

  const createCompany = async ({ name, address, number, email }) => {
    const response = await fetch(apiUrl('company/create'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, address, number, email }),
    });
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to create company');
    }
    return navigate('/admin-dashboard');
  };

  return { createCompany };
}

export default useCompany;