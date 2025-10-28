
import { Button } from "@/components/ui/button"
import * as React from "react"
import Calendar from "./Calendar";
import { ExternalLink, ExternalLinkIcon, LinkIcon } from "lucide-react";
import { initServerClient } from "@/lib/supabase/server";
import ViewBooking from "@/app/dashboard/ViewBooking";

function getTimeUntilBooking(date_and_time: string): string {
  const now = new Date();
  const bookingDate = new Date(date_and_time);

  const diffMs = bookingDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Booking time has passed";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days} Dage, ${hours} Timer, ${minutes} Minuter indtil bookingen`;
}

async function getTodaysBookings() {
  const supabase = await initServerClient();
  const today = new Date();
  const targetDay = today.toISOString().split("T")[0]; 
  const start = `${targetDay}T00:00:00Z`;
  const end = `${targetDay}T23:59:59Z`;

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("date_and_time", start)
    .lte("date_and_time", end);

  return bookings;
}

export default async function Home() {
  const supabase = await initServerClient();
  const { data: bookings, error } = await supabase.from("bookings").select("*").eq("status", "pending");
  
  const todaysBookings = await getTodaysBookings()
  return (
    <>
      <div className="flex justify-center pb-10 border-b mx-2">
        <Calendar />
      </div>

      <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-6 px-4 mt-8">
        <div
          className=" lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]">
          <div>
            <p className="border-b p-6 font-medium">Ubesvarede anmodninger</p>
          </div>
          <div className="p-4">
            {bookings?.map((booking) => (
              <div
                key={booking.id}
                className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between"
              >
                <div>
                  <div className="font-medium">Booking til {booking.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {getTimeUntilBooking(booking.date_and_time)}
                  </div>
                </div>
                  <ViewBooking bookingId={booking.id} />
                {/*<Button>*/}
                {/*  Se*/}
                {/*  <ExternalLinkIcon />*/}
                {/*</Button>*/}
              </div>
            ))}
          </div>
        </div>

        <div className=" lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]  ">
          <div>
            <p className="border-b p-6 font-medium">Bookinger i dag</p>
          </div>
          <div className="p-4">
            {(todaysBookings?.length) ? todaysBookings?.map((booking) => (
              <div
                key={booking.id}
                className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between">
                <div>
                  <div className="font-medium">Booking til {booking.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {getTimeUntilBooking(booking.date_and_time)}
                  </div>
                </div>
              </div>
            )) : <p>Ingen bookinger i dag</p>
            }

          </div>
        </div>
      </div>
    </>
  );
}
