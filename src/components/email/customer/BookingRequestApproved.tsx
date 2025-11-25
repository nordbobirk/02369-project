import { Text } from "@react-email/components";
import CustomerEmailLayout from "./components/CustomerEmailLayout";
import { anchor, paragraph } from "../styles";
import { ManageBookingLinkButton } from "./components/ManageBookingLinkButton";
import { getEnvironmentUrl } from "@/lib/url";

export default function BookingRequestApproved({
  manageBookingLink,
}: {
  manageBookingLink: string;
}) {
  return (
    <CustomerEmailLayout title="Din bookinganmodning er blevet godkendt">
      <Text style={paragraph}>
        Jeg har kigget på dine ønsker til tatovering(er), og jeg glæder mig til
        at komme i gang med dit projekt. Derfor er din bookinganmodning nu
        godkendt.
      </Text>
      <Text style={paragraph}>
        Hvis du har spørgsmål til de næste skridt i processen, kan du læse mere
        på min{" "}
        <a href={`${getEnvironmentUrl()}`} style={anchor}>
          hjemmeside
        </a>.
      </Text>
      <ManageBookingLinkButton manageBookingLink={manageBookingLink} />
    </CustomerEmailLayout>
  );
}
