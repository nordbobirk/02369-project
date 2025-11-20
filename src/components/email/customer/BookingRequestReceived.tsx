import { Button, Text } from "@react-email/components";
import CustomerEmailLayout from "./CustomerEmailLayout";
import { button, paragraph } from "../styles";

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
      <Text style={paragraph}>
        yeet yada yeet yeet yada yoooooo wazzzzupppppp
      </Text>
      <Button style={button} href={manageBookingLink} target="_blank">
        Ændr tid eller aflys din booking
      </Button>
    </CustomerEmailLayout>
  );
}
