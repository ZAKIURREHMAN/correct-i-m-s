import React from "react";
import {tabs} from "../constant/Constant"
import { useNavigate } from "react-router-dom"

function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }) {
  const navigate = useNavigate()
  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto shrink-0 z-40 print:hidden`}
    >
       <div className="p-5 flex justify-between items-center border-b border-gray-100">
        {isOpen && (
          <span className="text-xl font-bold text-indigo-600">
            Admin
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-indigo-600 transition cursor-pointer "
        >
          ☰
        </button>
      </div>

       <nav className="flex-1 p-4 space-y-2">
    {tabs.map((tab) => (
  <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      activeTab === tab.id
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
    }`}
  >
    {isOpen ? tab.label : tab.label[0]}
  </button>
))}
      </nav>

       <div className="p-4 border-t border-gray-100">
        <button className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded-xl hover:bg-indigo-700 transition" onClick={() => { localStorage.removeItem('auth'); navigate('/'); }}>
          {isOpen ? "Logout" : "↩"}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;