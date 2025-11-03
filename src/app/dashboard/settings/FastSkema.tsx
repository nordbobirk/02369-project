"use client";

import { Button } from "@/components/ui/button";

export default function FastSkema({ onClose }: { onClose: () => void }) {
  const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];

  const schedule = [
    ["Matematik", "Dansk", "Fri", "Engelsk", "Kemi"],
    ["Fysik", "IT", "Fri", "Historie", "Biologi"],
    ["Frokost", "Frokost", "Frokost", "Frokost", "Frokost"],
    ["Projekt", "Fri", "Fri", "Samfundsfag", "Fri"],
  ];

  return (
    <div className="w-full md:w-3/4 bg-gray-100 p-6 md:p-8 rounded-2xl shadow-inner flex flex-col text-left">
      <h2 className="text-xl font-semibold mb-6 text-center">Skema</h2>

      <div className="overflow-x-auto rounded-lg overflow-hidden">
        <table className="min-w-full border border-gray-300 rounded-lg bg-white text-center shadow">
          <thead>
            <tr className="bg-gray-100 text-gray-700 rounded-lg">
              {days.map((day, i) => (
                <th
                  key={i}
                  className="py-3 px-4 font-semibold border border-gray-300"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {schedule.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                {row.map((subject, j) => (
                  <td
                    key={j}
                    className="py-5 px-4 border border-gray-300 rounded-lg"
                  >
                    {subject}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={onClose} className="mt-6 self-center">
        Luk
      </Button>
    </div>
  );
}
