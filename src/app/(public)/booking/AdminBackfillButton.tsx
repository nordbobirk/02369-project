"use client";

import { useState } from "react";
import { backfillMissingOTPs } from '@/app/(public)/booking/edit_booking/[id]/actions'; // Make sure this path points to your server action file

export default function AdminBackfillButton() {
  const [loading, setLoading] = useState(false);

  const handleBackfill = async () => {
    if (!confirm("⚠️ Are you sure you want to generate OTPs for all old bookings?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await backfillMissingOTPs();
      
      if (result.success) {
        alert(`✅ Success! Updated ${result.count} bookings.\nCheck 'temp_otps.txt' for the codes.`);
      } else {
        alert(`❌ Error: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 my-4 border border-red-200 bg-red-50 rounded-lg">
      <h3 className="font-bold text-red-800 mb-2">Admin Zone (Temp)</h3>
      <button
        onClick={handleBackfill}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : "Run OTP Backfill"}
      </button>
      <p className="text-xs text-red-600 mt-2">
        Check <code>temp_otps.txt</code> in your project root after running.
      </p>
    </div>
  );
}