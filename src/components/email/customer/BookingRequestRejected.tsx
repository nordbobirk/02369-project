import { Heading, Hr, Text } from "@react-email/components";
import CustomerEmailLayout from "./components/CustomerEmailLayout";
import { anchor, heading, hr, paragraph } from "../styles";

export default function BookingRequestRejected({
  rejectionReason,
}: {
  rejectionReason: string;
}) {
  return (
    <CustomerEmailLayout title="Din bookinganmodning er blevet afvist">
      <Text style={paragraph}>
        Jeg har kigget på dine ønsker til tatovering(er), og jeg er desværre
        nødt til at afvise din bookinganmodning.
      </Text>
      <Hr style={hr} />
      <Heading style={heading} as="h3">Hvorfor er din anmodning blevet afvist?</Heading>
      <Text style={paragraph}>{rejectionReason}</Text>
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
