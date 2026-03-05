import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  let isAuthed = false
  try {
    const raw = localStorage.getItem('auth')
    if (raw) {
      const payload = JSON.parse(raw)
      isAuthed = !!(payload && payload.status === 200 && payload.user)
    }
  } catch (e) {
    isAuthed = false
  }

  return isAuthed ? <>{children}</> : <Navigate to="/" replace />
}