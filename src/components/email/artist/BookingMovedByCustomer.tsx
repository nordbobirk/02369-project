import { Button, Text } from "@react-email/components";
import ArtistEmailLayout from "./components/ArtistEmailLayout";
import { paragraph } from "../styles";

export default function BookingRequestApproved({
  bookingRequestId,
  customerName,
  bookingTime,
}: {
  bookingRequestId: string;
  customerName: string;
  bookingTime: string;
}) {
  return (
    <ArtistEmailLayout title="Booking flyttet">
      <Text style={paragraph}>
        Bookingen med {customerName} er blevet flyttet til den {bookingTime}.
      </Text>
      <Button
        href={`https://bebsisbooking.dk/dashboard/view_booking/${bookingRequestId}`}
      >
        Se bookingen her
      </Button>
    </ArtistEmailLayout>
  );
}
