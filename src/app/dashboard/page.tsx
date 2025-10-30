
import * as React from "react"
import Calendar from "./Calendar";
import { initServerClient } from "@/lib/supabase/server";
import ViewBooking from "@/app/dashboard/ViewBooking";
import { getTodaysBookings, getTimeUntilBooking, getPendingBookings, Tattoo } from "./actions"

export default async function Home() {
  const supabase = await initServerClient();
  const pendingBookings = await getPendingBookings();

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
            {pendingBookings?.map((booking) => (
              <div
                key={booking.id}
                className="mb-3 bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full flex justify-between "
              >
                <div>
                  <div className="font-medium">Booking til {booking.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {(booking.tattoos == null || booking.tattoos.length == 0) ?
                      <div>
                        <p>Ingen tatovering med booking</p>
                      </div> :
                      booking.tattoos.length > 1 ?
                        <div>
                          <p>Flere tatoveringer i booking</p>
                          <div>
                            Samlet varighed: {booking.tattoos?.reduce((acc: number, tattoo: Tattoo) => acc + tattoo.estimated_duration, 0) ?? 0} min
                          </div>
                          <div>
                            {getTimeUntilBooking(booking.date_and_time)}
                          </div>
                        </div> :
                        <div>
                          <div>
                            Varighed: {booking.tattoos.at(0)?.estimated_duration?.toString()} minutter
                          </div>
                          <div>
                            Kompleksitet: {booking.tattoos.at(0)?.detail_level?.toString()}
                          </div>
                          <div>
                            {getTimeUntilBooking(booking.date_and_time)}
                          </div>
                        </div>}
                  </div>
                </div>
                <ViewBooking bookingId={booking.id} />
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
                    {booking.tattoos.length == 0 ? <p>Ingen tatovering med booking</p> :
                      booking.tattoos.length > 1 ?
                        <div>
                          <p>Flere tatoveringer i booking</p>
                          <div>
                            Samlet varighed: {booking.tattoos?.reduce((acc: number, tattoo: Tattoo) => acc + tattoo.estimated_duration, 0) ?? 0} min
                          </div>
                          <div>
                            {getTimeUntilBooking(booking.date_and_time)}
                          </div>
                        </div>
                        :
                        <div>
                          <div>
                            {getTimeUntilBooking(booking.date_and_time)}
                          </div>
                          <div>
                            Varighed: {booking.tattoos.at(0)?.estimated_duration?.toString()} minutter
                          </div>
                          <div>
                            Kompleksitet: {booking.tattoos.at(0)?.detail_level?.toString()}
                          </div>
                        </div>}
                  </div>
                </div>
                {/* TODO: Implement link til booking details here. */}
              </div>
            )) : <p>Ingen bookinger i dag</p>
            }

          </div>
        </div>
      </div>
    </>
  );
}
