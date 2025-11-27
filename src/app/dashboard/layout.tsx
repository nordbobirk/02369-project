"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CircleQuestionMarkIcon,
  HomeIcon,
  SettingsIcon,
} from "lucide-react";
import { initBrowserClient } from "@/lib/supabase/client";
import { DropdownMenuDemo } from "./DropdownMenu";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    const supabase = initBrowserClient();

    async function loadPending() {
      const { count, error } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) console.error("❌ Pending count error:", error);

      setPendingCount(count ?? 0);
    }

    loadPending();

    // Real-time updates
    const channel = supabase
      .channel("pending-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        loadPending
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const PendingBadge = () =>
    pendingCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
        {pendingCount}
      </span>
    );

  return (
    <div>
      <header>
        <div className="m-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">

            {/* HOME */}
            <Button variant="secondary" asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
                <HomeIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Hjem</span>
              </Link>
            </Button>

            {/* CALENDAR */}
            <Button variant="secondary" asChild>
              <Link href="/dashboard/calendar" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Kalender</span>
              </Link>
            </Button>

            {/* PENDING REQUESTS — WITH BADGE */}
            <div className="relative">
              <Button variant="secondary" asChild>
                <Link
                  href="/dashboard/pending_bookings"
                  className="flex items-center gap-1"
                >
                  <CircleQuestionMarkIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Ubesvarede anmodninger</span>
                </Link>
              </Button>

              <PendingBadge />
            </div>

            {/* SETTINGS */}
            <Button variant="secondary" asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-1">
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Præferencer</span>
              </Link>
            </Button>
          </div>

          <div className="ml-auto">
            <DropdownMenuDemo />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
