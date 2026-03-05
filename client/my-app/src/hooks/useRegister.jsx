import React from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from "../lib/api";

function useRegister() {
    const navigate = useNavigate()
    const registerUser = async({name,email,password})=>{
        const response = await fetch(apiUrl("auth/register"),
            {
                method:'POST',
                headers:{
                    "Content-Type":'application/json',
                },
                body:JSON.stringify({name,email,password})
            }
        )
        console.log(response)
        const data = await response.json()
        if(!response.ok){
            throw new Error(data?.message || "Failed to register")
        }
        return navigate('/admin-dashboard')
    }

  return {registerUser}
}

export default useRegister
