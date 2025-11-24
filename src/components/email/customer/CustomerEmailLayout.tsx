import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { main, container, box, heading, footer, hr, anchor } from "../styles";

export default function CustomerEmailLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="dk">
      <Head />
      <Body style={main}>
        <Preview>{title}</Preview>
        <Container style={container}>
          <Section style={box}>
            <Heading style={heading}>{title}</Heading>
            {children}
            <Hr style={hr} />
            <Text style={footer}>
              Denne email er sendt automatisk og kan ikke besvares. Hvis du har
              spørgsmål, kan du finde kontaktoplysninger på min{" "}
              <a href="https://bebsisbooking.dk" style={anchor}>
                hjemmeside
              </a>
              . Andrea Carlberg, cvr: 43738380
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
