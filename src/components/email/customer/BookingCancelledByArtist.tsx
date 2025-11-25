import { Text } from "@react-email/components";
import CustomerEmailLayout from "./components/CustomerEmailLayout";
import { anchor, paragraph } from "../styles";

export default function BookingRequestApproved({
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
        <a href="https://bebsisbooking.dk" style={anchor}>
          hjemmeside
        </a>
        .
      </Text>
    </CustomerEmailLayout>
  );
}
