import * as React from "react"
import { initServerClient } from "@/lib/supabase/server";
import Calendar from "./Calendar";


export default async function Page() {
  return (
    <div className="flex justify-center pb-10 border-b mx-2">
      <Calendar />
    </div>
  )
}