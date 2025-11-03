"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Tilgængelighed({ onClose }: { onClose: () => void }) {
  const [day, setDay] = useState("Mandag");
  const [date, setDate] = useState("");

  const handleShift = (direction: "forward" | "backward") => {
    const shift = direction === "forward" ? "frem" : "tilbage";
    console.log(`Ryk frokostpause én time ${shift} for ${day}, ${date || "ingen dato valgt"}`);
    alert(`Frokostpausen er rykket én time ${shift}.`);
    onClose();
  };

  return (
    <div className="w-full md:w-1/2 bg-gray-100 p-10 rounded-2xl shadow-inner flex flex-col items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm space-y-6">
        <h2 className="text-xl font-semibold text-center mb-4">Skub frokostpause</h2>

        {/* Dato */}
        <div className="space-y-2">
          <label className="font-medium">Vælg dato</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-primary"
          />
        </div>

       

        {/* Knapper */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <Button
            onClick={() => handleShift("backward")}
            className="w-full sm:w-auto bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
             Ryk en time tilbage
          </Button>

          <Button
            onClick={() => handleShift("forward")}
            className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
          >
             Ryk en time frem
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full mt-4"
        >
          Gem ændring
        </Button>
      </div>
    </div>
  );
}
