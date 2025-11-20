"use client";

import { useState } from "react";
import { validateBookingOtp } from "./actions"; // Import the action we made above

export default function BookingGate({
  bookingId,
  children,
}: {
  bookingId: string;
  children: React.ReactNode;
}) {
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call the Server Action
    const result = await validateBookingOtp(bookingId, code);

    if (result.success) {
      setIsVerified(true);
    } else {
      // Translated fallback error message
      setError(result.message || "Forkert kode");
    }
    setLoading(false);
  }

  // If verified, render the sensitive BookingInfo
  if (isVerified) {
    return <>{children}</>;
  }

  // Otherwise, render the Lock Screen
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Sikkerhedsbekræftelse</h2>
      <p className="mb-4 text-gray-600">
        Indtast den 6-cifrede kode, der er sendt til din email, for at se din booking.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          className="w-full p-2 border rounded"
          maxLength={6}
          required
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Bekræfter..." : "Lås booking op"}
        </button>
      </form>
    </div>
  );
}