import { render } from "@react-email/components";
import { createTransport, getTestMessageUrl } from "nodemailer";
import "server-only";

function getHost(): string {
  const host = process.env.SMTP_HOST;
  if (!host) {
    throw new Error("no smtp host configured");
  }
  return host;
}

function getPort(): number {
  const portString = process.env.SMTP_PORT;
  try {
    const port = Number(portString);
    return port;
  } catch {
    throw new Error("smtp port misconfigurated");
  }
}

function getSecure(port: number): boolean {
  // secure true for TLS connections, defaulting to port 465. secure=false for port 587 or other non-TLS connections
  return port === 465;
}

function getUser(): string {
  const user = process.env.SMTP_USER;
  if (!user) {
    throw new Error("no smtp user configured");
  }
  return user;
}

function getPass(): string {
  const pass = process.env.SMTP_PASS;
  if (!pass) {
    throw new Error("no smtp pass configured");
  }
  return pass;
}

function getTransport() {
  const port = getPort();
  return createTransport({
    host: getHost(),
    port: port,
    secure: getSecure(port),
    auth: {
      user: getUser(),
      pass: getPass(),
    },
  });
}

function getSender() {
  return '"Bebsis Booking" <noreply@bebsisbooking.dk>';
}

type SendEmailOptions = {
  to: string;
  subject: string;
  content: React.ReactNode;
};

export async function sendEmail(email: SendEmailOptions) {
  const transport = getTransport();
  await transport.sendMail(
    {
      from: getSender(),
      to: email.to,
      subject: email.subject,
      text: await render(email.content, { plainText: true }),
      html: await render(email.content, { pretty: true }),
    },
    (err, info) => {
      if (err) {
        console.log("error occured during email sending: %s", err.message);
        return;
      }

      console.log("email sent: %s", info.messageId);
      if (process.env.NODE_ENV !== "development") {
        console.log("email preview url: %s", getTestMessageUrl(info));
      }
    }
  );
}
