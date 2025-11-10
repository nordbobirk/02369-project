
import * as React from "react"

import { initServerClient } from "@/lib/supabase/server";
import { getTodaysBookings, getPendingBookings, Tattoo } from "./actions"
import BookingCard from "./Booking";

export default async function Home() {
  const supabase = await initServerClient();
  const pendingBookings = await getPendingBookings();

  const todaysBookings = await getTodaysBookings()
  return (
    <>
      <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-6 px-4 mt-8">
        <div
          className=" lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]">
          <div>
            <p className="border-b p-6 font-medium">Der er {pendingBookings?.length} ubesvarede anmodninger</p>
          </div>
          <div className="p-4">
            {pendingBookings?.map((booking) => (
              <BookingCard booking={booking} key={booking.id}></BookingCard>
            ))}
          </div>
        </div>

        <div className=" lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]  ">
          <div>
            <p className="border-b p-6 font-medium">Bookinger i dag</p>
          </div>
          <div className="p-4">
            {(todaysBookings?.length) ? todaysBookings?.map((booking) => (
              <BookingCard booking={booking} key={booking.id}></BookingCard>
            )) : <p>Ingen bookinger i dag</p>
            }

          </div>
        </div>
      </div>
    </>
  );
}
