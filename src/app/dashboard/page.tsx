"use client";

import * as React from "react";
import { Booking, getLimitedBookingsAfterDate } from "./actions";
import BookingCard from "./Booking";

export default function Home() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const limit = 5;

  const fetchBookings = React.useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newBookings = await getLimitedBookingsAfterDate(limit, offset);

    setBookings(prev => [...prev, ...newBookings]);
    setOffset(prev => prev + newBookings.length);
    setHasMore(newBookings.length === limit);
    setLoading(false);
  }, [offset, loading, hasMore]);

  React.useEffect(() => {
    setBookings([]);
    setOffset(0);
    setHasMore(true);
    setLoading(false);
  }, []);


  const bookingsByDate = bookings.reduce((groups, booking) => {
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

  const sortedDateGroups = Object.keys(bookingsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore) return; 

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchBookings();
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchBookings, loading, hasMore]);

  return (
    <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-6 px-4 mt-8">
      <div className="lg:m-4 rounded-xl border shadow-sm w-full lg:w-[45%]">
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {sortedDateGroups.map(date => (
            <div key={date} className="mb-8">
              <p className="border-b p-6 font-medium text-lg">{date}</p>
              {bookingsByDate[date]
                .sort((a, b) => new Date(a.date_and_time).getTime() - new Date(b.date_and_time).getTime())
                .map(booking => <BookingCard key={booking.id} booking={booking} />)}
            </div>
          ))}

          {loading && <p className="text-center my-4">Loading...</p>}
          {!hasMore && <p className="text-center my-4">Ikke flere bookinger.</p>}

          <div ref={loadMoreRef} />
        </div>
      </div>
    </div>
  );
}
