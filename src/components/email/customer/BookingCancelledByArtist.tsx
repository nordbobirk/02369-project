import { Text } from "@react-email/components";
import CustomerEmailLayout from "./components/CustomerEmailLayout";
import { anchor, paragraph } from "../styles";
import { getEnvironmentUrl } from "@/lib/url";

export default function BookingCancelledByArtist({
  bookingTime,
}: {
  bookingTime: string;
}) {
  return (
    <CustomerEmailLayout title="Din booking er blevet aflyst">
      <Text style={paragraph}>
        Jeg har desværre været nødt til at aflyse din booking den {bookingTime}. Jeg vil kontakte
        dig direkte med henblik på at finde en ny tid til dig.
      </Text>
      <Text style={paragraph}>
        Hvis du har spørgsmål, kan du læse mere på min{" "}
        <a href={getEnvironmentUrl()} style={anchor}>
          hjemmeside
        </a>
        .
      </Text>
    </CustomerEmailLayout>
  );
}
