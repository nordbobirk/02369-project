import { Button, Text } from "@react-email/components";
import { button, paragraph } from "../../styles";

export function ManageBookingLinkButton({
  manageBookingLink,
}: {
  manageBookingLink: string;
}) {
  return (
    <>
      <Text style={paragraph}>
        Hvis du har brug for at se din booking, ændre tidspunktet eller aflyse,
        kan du trykke herunder.
      </Text>
      <Button style={button} href={manageBookingLink} target="_blank">
        Se din booking, ændr tid eller aflys din booking
      </Button>
    </>
  );
}
