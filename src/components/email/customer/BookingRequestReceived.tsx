import { Text } from "@react-email/components";
import CustomerEmailLayout from "./components/CustomerEmailLayout";
import { paragraph } from "../styles";
import { ManageBookingLinkButton } from "./components/ManageBookingLinkButton";

export default function BookingRequestReceived({
  manageBookingLink,
}: {
  manageBookingLink: string;
}) {
  return (
    <CustomerEmailLayout title="Din bookinganmodning er modtaget">
      <Text style={paragraph}>
        Jeg har modtaget din bookinganmodning og din betaling er hermed
        bekræftet (ordrenummer #12345).
      </Text>
      <Text style={paragraph}>
        Jeg vil snarest muligt gennemgå de oplysninger, du har indsendt, om den
        eller de tatoveringer, du ønsker at få lavet hos mig, og bekræfte din
        booking. Når din booking bliver bekræftet, modtager du endnu en email.
      </Text>
      <ManageBookingLinkButton manageBookingLink={manageBookingLink} />
    </CustomerEmailLayout>
  );
}
