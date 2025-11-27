import { Text } from "@react-email/components";
import CustomerEmailLayout from "./components/CustomerEmailLayout";
import { anchor, paragraph } from "../styles";
import { getEnvironmentUrl } from "@/lib/url";

export default function BookingRequestApproved() {
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
        </a>
        .
      </Text>
      <Text style={paragraph}>
        Hvis du ønsker at ændre tidspunktet for din booking eller aflyse den,
        kan du finde et link i bookinganmodningsbekræftelsen, der tidligere er blevet sendt til dig på mail.
      </Text>
    </CustomerEmailLayout>
  );
}
