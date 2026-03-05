import React from 'react'
import logo from '../assets/logo.jpeg'

function Navbar() {
  const auth = (() => {
    try { return JSON.parse(localStorage.getItem('auth') || 'null') } catch { return null }
  })()
  const name = auth?.user?.name || 'User'
  const initial = (name?.[0] || 'U').toUpperCase()
  return (
      <main className="flex-1 flex flex-col">
      
      <header className="fixed top-0 left-0 right-0 h-16 bg-white px-8 border-b border-gray-200 flex justify-between items-center z-50 print:hidden">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{name}</span>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
            {initial}
          </div>
        </div>
      </header>
    </main>
  )
}

export default Navbar
