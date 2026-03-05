import React from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from "../lib/api";

function useLogin() {
    const navigate = useNavigate()
    const loginUser = async({email,password})=>{
        const response = await fetch(apiUrl("auth/login"),
            {
                method:'POST',
                headers:{
                    "Content-Type":'application/json',
                },
                body:JSON.stringify({email,password})
            }
        )
        const data = await response.json()
        const payload = data?.data
        if(payload?.status !== 200){
            console.log(payload?.message || data?.message || "Failed to login")
            return null
        }
        try {
            // Store auth payload in localStorage for route guarding
            localStorage.setItem('auth', JSON.stringify(payload))
        } catch (e) {
            console.warn('Failed to persist auth to localStorage:', e)
        }
        return navigate('/admin-dashboard')
    }

    return { loginUser }
}

export default useLogin
