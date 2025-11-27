export function getBookingTime(
  data:
    | {
        date_and_time: any;
      }[]
    | null
) {
  const timestamp =
    data && Array.isArray(data) && data.length > 0
      ? (data[0].date_and_time as unknown)
      : null;
  if (timestamp && typeof timestamp === "string") {
    try {
      return new Date(timestamp);
    } catch {}
  }
  throw new Error("failed to get booking date");
}

export function getBookingTimeString(date: Date) {
  return (
    date
      .toLocaleString("da-DK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", " kl.")
  );
}
