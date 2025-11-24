import { getPendingBookings } from "../actions"
import BookingTable from "./BookingTable"

export default async function BookingsPage() {
  const data = await getPendingBookings() 
  return <BookingTable data={data} />
}
