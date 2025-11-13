"use client";
import React, { useState, useEffect } from "react";
import { initBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function EditEmail() {
  const [recordId, setRecordId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchEmail() {
      const supabase = initBrowserClient();

      const { data, error } = await supabase
        .from("notifications")
        .select("id, email")
        .limit(1)
        .single();

      if (error) {
        console.error("❌ Error fetching email:", error);
      } else if (data) {
        console.log("📬 Fetched email:", data);
        setRecordId(data.id);
        setEmail(data.email);
        setNewEmail(data.email);
      }
      setLoading(false);
    }
    fetchEmail();
  }, []);

  async function handleSave() {
    if (!recordId) {
      console.error("❌ No record ID found, cannot update.");
      return;
    }

    setSaved(false);
    const supabase = initBrowserClient();

    console.log("🆕 Updating email to:", newEmail, "for ID:", recordId);

    const { data, error } = await supabase
      .from("notifications")
      .update({ email: newEmail, updated_at: new Date().toISOString() })
      .eq("id", recordId)
      .select()
      .maybeSingle();

    console.log("🔄 Supabase result:", { data, error });

    if (error) {
      console.error("❌ Error updating:", error);
    } else {
      setEmail(newEmail);
      setEditing(false);
      setSaved(true);
      console.log("✅ Email updated successfully!");
    }
  }

  if (loading) return <p className="text-gray-500">Indlæser e-mail...</p>;

  return (
    <div className="p-8 flex flex-col items-center w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-center">Opdater din e-mail for notifikationer</h2>

      <div className="flex items-center justify-between w-full mb-6">
        <span className="text-gray-500 font-medium">Din nuværende e-mail</span>
        <div className="border border-gray-200 rounded-xl px-4 py-2 shadow-sm bg-white">
          <span className="text-gray-900 font-semibold">{email || "Ingen e-mail"}</span>
        </div>
      </div>

      {!editing ? (
        <Button
          onClick={() => setEditing(true)}
          className="bg-rose-300 hover:bg-rose-300 font-semibold rounded-xl px-6 py-2"
        >
          Skift e-mail
        </Button>
      ) : (
        <div className="flex flex-col items-center w-full max-w-sm">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Indtast ny e-mail"
            className="border border-gray-300 rounded-xl px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-rose-300 shadow-sm"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="bg-rose-300 hover:bg-rose-400 font-semibold rounded-xl px-5"
            >
              Gem ændring
            </Button>

            <Button
              onClick={() => {
                setNewEmail(email);
                setEditing(false);
              }}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-xl px-5"
            >
              Annuller
            </Button>
          </div>
        </div>
      )}

      {saved && <p className="text-black-300 mt-5 text-sm">Din email er nu opdateret!</p>}
    </div>
  );
}
