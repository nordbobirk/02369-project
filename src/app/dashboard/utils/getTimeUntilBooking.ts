export function getTimeUntilBooking(date_and_time: string): string {
    const now = new Date();
    const bookingDate = new Date(date_and_time);

    const diffMs = bookingDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Bookingen er startet";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} Dage, ${hours} Timer, ${minutes} Minuter indtil bookingen`;
}