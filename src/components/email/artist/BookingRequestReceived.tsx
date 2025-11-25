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
    <ArtistEmailLayout title="Ny bookinganmodning">
      <Text style={paragraph}>
        Du har modtaget en ny bookinganmodning fra {customerName} den{" "}
        {bookingTime}.
      </Text>
      <Button
        href={`https://bebsisbooking.dk/dashboard/view_booking/${bookingRequestId}`}
      >
        Se bookinganmodningen her
      </Button>
    </ArtistEmailLayout>
  );
}
