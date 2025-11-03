"use client";

import { useState } from "react";
import { ChevronRight, ClipboardClock, CalendarCheck, FilePenLine } from "lucide-react";
import FastSkema from "./FastSkema";
import Tilgængelighed from "./Tilgængelighed";

export default function Page() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const items = [
    { icon: <ClipboardClock />, label: "Fast skema" },
    { icon: <CalendarCheck />, label: "Tilgængelighed" },
    { icon: <FilePenLine />, label: "Rediger FAQ" },
    
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-10 bg-white gap-8">
      {/* Left side list */}
      <div className="w-full sm:w-[400px] md:w-[500px] rounded-2xl border border-border bg-card shadow-md overflow-hidden">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => setActivePanel(item.label)}
            className="flex items-center justify-between w-full px-6 py-5 hover:bg-muted/50 transition-all border-b last:border-none"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                {item.icon}
              </div>
              <span className="text-base font-medium text-foreground">
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Right side panels */}
      {activePanel === "Fast skema" && (
        <FastSkema onClose={() => setActivePanel(null)} />
      )}

      {activePanel === "Tilgængelighed" && (
        <Tilgængelighed onClose={() => setActivePanel(null)} />
      )}
    </div>
  );
}
