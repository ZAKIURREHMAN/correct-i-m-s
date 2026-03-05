import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      {/* Fixed Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Scrollable Main Content */}
      <div
        className={`${isOpen ? "ml-64" : "ml-20"} pt-16 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
}

export default AdminLayout;