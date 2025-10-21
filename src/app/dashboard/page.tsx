"use client"

import { Button } from "@/components/ui/button"
import { CalendarIcon, HomeIcon, SettingsIcon } from "lucide-react";

import * as React from "react"
import Calender31 from "./calendar-31"


// TODO add events from database
const events = [
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Design Review",
    from: "2025-06-12T11:30:00",
    to: "2025-06-12T12:30:00",
  },
  {
    title: "Client Presentation",
    from: "2025-06-12T14:00:00",
    to: "2025-06-12T15:00:00",
  },
]

export default function Home() {

  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
    <div>

      <div className="m-8">
        <Button variant={"secondary"}> 
          <HomeIcon />Home
        </Button>
        <Button variant={"secondary"}>
          <CalendarIcon/> Calendar
        </Button>
        <Button variant={"secondary"}>
          <SettingsIcon/>Settings
        </Button>
      </div>



      Hello world, I am a dashboard
      <div className="">
        <Calender31></Calender31>
      </div>
    </div>
  );
}
