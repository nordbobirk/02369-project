import { getAllBookings } from "../actions"
import BookingTable from "./BookingTable"

export default async function BookingsPage() {
  const data = await getAllBookings() 
  return <BookingTable data={data} />
}
