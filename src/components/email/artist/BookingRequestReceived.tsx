import { Button, Text } from "@react-email/components";
import ArtistEmailLayout from "./components/ArtistEmailLayout";
import { paragraph } from "../styles";
import { getEnvironmentUrl } from "@/lib/url";

export default function BookingRequestReceived({
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
        href={`${getEnvironmentUrl()}/dashboard/view_booking/${bookingRequestId}`}
      >
        Se bookinganmodningen her
      </Button>
    </ArtistEmailLayout>
  );
}
