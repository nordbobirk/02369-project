"use client";

import React, { useState } from "react";
import { Menu, X, CalendarCheck, Clock, Settings } from "lucide-react";
import FastSkema from "./FastSkema";
import Tilgængelighed from "./Tilgængelighed"; 

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("skema");

  const items = [
    { id: "skema", label: "Fast skema", icon: <CalendarCheck size={18} /> },
    { id: "tid", label: "Tilgængelighed", icon: <Clock size={18} /> },
    { id: "indstillinger", label: "Indstillinger", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/*  Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <h1 className="text-lg font-semibold">Tattoo Studio</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md border bg-gray-100 hover:bg-gray-200 transition"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-64 z-20 bg-white border-r shadow-lg md:shadow-none transform transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>

        <nav className="flex flex-col">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePanel(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-6 py-4 text-left text-sm font-medium border-b hover:bg-gray-100 ${
                activePanel === item.id ? "bg-gray-100 text-pink-600" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {activePanel === "skema" && <FastSkema />}
        {activePanel === "tid" && <Tilgængelighed />} 
        {activePanel === "indstillinger" && (
          <div className="p-8 text-center text-gray-400">
          
          </div>
        )}
      </main>
    </div>
  );
}
