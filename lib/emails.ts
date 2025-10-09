import ContactEmail, {
  ContactEmailProps,
} from "@/components/emails/ContactEmail";
import { resend } from "./resend";

export async function sendContactEmail({
  email,
  name,
  subject,
  message,
}: ContactEmailProps) {
  await resend.emails.send({
    from: "International Dance Nigeria <contact@internationaldance.ng>",
    to: "info@internationaldance.ng",
    subject: `New Contact Form Submission: ${subject}`,
    react: await ContactEmail({ email, name, subject, message }),
  });
}
