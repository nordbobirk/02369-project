"use client";

import * as React from "react";
import { Booking, getLimitedBookingsAfterDate, getLimitedOldBookings } from "./actions";
import BookingCard from "./Booking";
import { ContrastIcon, Loader2Icon, LoaderIcon, LoaderPinwheelIcon, MenuIcon, PlusSquareIcon } from "lucide-react";

// Helper: group bookings by date
function groupBookingsByDate(bookings: Booking[]): Record<string, Booking[]> {
  return bookings.reduce((groups, booking) => {
    const dateObj = new Date(booking.date_and_time);
    const dateKey = dateObj.toLocaleDateString("da-DK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(booking);
    return groups;
  }, {} as Record<string, Booking[]>);
}

// Subcomponent for rendering grouped bookings
function BookingGroups({
  grouped,
  sortedDates,
  descending = false,
}: {
  grouped: Record<string, Booking[]>;
  sortedDates: string[];
  descending?: boolean;
}) {
  return (
    <>
      {sortedDates.map(date => (
        <div key={date} className="mb-8">
          <p className="border-b p-6 font-medium text-lg">{date}</p>
          {grouped[date]
            .sort((a, b) =>
              descending
                ? new Date(b.date_and_time).getTime() -
                  new Date(a.date_and_time).getTime()
                : new Date(a.date_and_time).getTime() -
                  new Date(b.date_and_time).getTime()
            )
            .map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
        </div>
      ))}
    </>
  );
}

export default function Home() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [oldBookings, setOldBookings] = React.useState<Booking[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [oldOffset, setOldOffset] = React.useState(0); // ⬅️ NEW
  const [loading, setLoading] = React.useState(false);
  const [loadingOld, setLoadingOld] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [hasMoreOld, setHasMoreOld] = React.useState(true); // ⬅️ NEW
  const [oldShown, setOldShown] = React.useState(false);
  const limit = 5;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // --- FETCH FUTURE BOOKINGS ---
  const fetchBookings = React.useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newBookings = await getLimitedBookingsAfterDate(limit, offset);
    setBookings(prev => [...prev, ...newBookings]);
    setOffset(prev => prev + newBookings.length);
    setHasMore(newBookings.length === limit);
    setLoading(false);
  }, [offset, loading, hasMore]);

  // --- FETCH OLD BOOKINGS ---
  const fetchOldBookings = React.useCallback(async () => {
    if (loadingOld || !hasMoreOld) return;

    setLoadingOld(true);

    const container = scrollContainerRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;
    const prevScrollTop = container?.scrollTop ?? 0;

    const old = await getLimitedOldBookings(limit, oldOffset);

    setOldBookings(prev => [...prev, ...old]);
    setOldOffset(prev => prev + old.length);
    setHasMoreOld(old.length === limit); // ⬅️ determines if more exist
    setOldShown(true);
    setLoadingOld(false);

    // Preserve scroll position
    requestAnimationFrame(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          prevScrollTop + (newScrollHeight - prevScrollHeight);
      }
    });
  }, [loadingOld, oldOffset, hasMoreOld]);

  // --- INITIALIZE ---
  React.useEffect(() => {
    setBookings([]);
    setOffset(0);
    setHasMore(true);
    setLoading(false);
  }, []);

  // --- GROUPINGS ---
  const bookingsByDate = groupBookingsByDate(bookings);
  const sortedDateGroups = Object.keys(bookingsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const todayKey = new Date().toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const todaysBookings = bookingsByDate[todayKey] ?? [];

  const groupedOld = groupBookingsByDate(oldBookings);
  const sortedOldDates = Object.keys(groupedOld).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // --- INFINITE SCROLL FOR FUTURE BOOKINGS ---
  React.useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) fetchBookings();
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchBookings, loading, hasMore]);

  return (
    <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-6 px-4 mt-8">
      <div className="lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]">
        <div ref={scrollContainerRef} className="p-4 max-h-[75vh] overflow-y-auto">
          
          {/* ---- OLD BOOKINGS BUTTON ---- */}
          {(!oldShown || hasMoreOld) && (
            <div className="text-center mb-4 flex-row justify-center">
              <button
                onClick={fetchOldBookings}
                disabled={loadingOld}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border transition"
              >
                {loadingOld
                  ? "Henter gamle bookinger..."
                  : oldShown
                  ? "Vis flere gamle bookinger"
                  : "Vis gamle bookinger"}
              </button>
            </div>
          )}

          {/* ---- OLD BOOKINGS ---- */}
          {oldShown && oldBookings.length > 0 && (
            <div className="mb-8">
              <BookingGroups
                grouped={groupedOld}
                sortedDates={sortedOldDates}
                descending={true}
              />
            </div>
          )}

          {/* ---- TODAY ---- */}
          <div>
            <p className="border-b p-6 font-medium text-lg">I dag</p>
            {todaysBookings.length > 0 ? (
              todaysBookings
                .sort(
                  (a, b) =>
                    new Date(a.date_and_time).getTime() -
                    new Date(b.date_and_time).getTime()
                )
                .map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
            ) : (
              <p className="p-6 text-gray-500 italic">Ingen bookinger i dag.</p>
            )}
          </div>

          {/* ---- FUTURE BOOKINGS ---- */}
          {sortedDateGroups
            .filter(date => date !== todayKey)
            .map(date => (
              <div key={date} className="mb-8">
                <p className="border-b p-6 font-medium text-lg">{date}</p>
                {bookingsByDate[date]
                  .sort(
                    (a, b) =>
                      new Date(a.date_and_time).getTime() -
                      new Date(b.date_and_time).getTime()
                  )
                  .map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
              </div>
            ))}

          {loading && <p className="text-center my-4">Loading...</p>}
          {!hasMore && (
            <p className="text-center my-4">Ikke flere bookinger.</p>
          )}
          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
}
