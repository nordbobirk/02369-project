"use server";

import { initServerClient } from "@/lib/supabase/server";

type Booking = {
    id: string,
    name: string,
    date_and_time: string,
}

export async function getBookingsAtDate(date: Date) {
    const supabase = await initServerClient();

    const targetDay = date.toISOString().split("T")[0];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Convert them to ISO strings (which are UTC)
    const start = startOfDay.toISOString();
    const end = endOfDay.toISOString();

    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("id, name, date_and_time")
        .gte("date_and_time", start)
        .lte("date_and_time", end);

    return bookings as Booking[];
}

