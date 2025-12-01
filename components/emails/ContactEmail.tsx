import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ContactEmailProps = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactEmail = ({ name, email, subject, message }: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "20px auto",
            borderRadius: 12,
            padding: 24,
            maxWidth: 600,
          }}
        >
          <Section style={{ padding: "8px 0" }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
              New contact request
            </Text>
          </Section>

          <Section style={{ padding: "6px 0" }}>
            <Text style={{ color: "#475569", fontSize: 14 }}>
              You have received a new message via the website contact form.
              Details are below.
            </Text>
          </Section>

          <Section style={{ marginTop: 12, padding: 0 }}>
            <div>
              <div>
                <Text
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}
                >
                  Name
                </Text>
                <Text
                  style={{ fontSize: 15, color: "#0f172a", fontWeight: 600 }}
                >
                  {name}
                </Text>
              </div>

              <div>
                <Text
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}
                >
                  Email
                </Text>
                <Link
                  href={`mailto:${email}`}
                  style={{ fontSize: 15, color: "#0f172a", fontWeight: 600 }}
                >
                  {email}
                </Link>
              </div>

              <div>
                <Text
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}
                >
                  Subject
                </Text>
                <Text
                  style={{ fontSize: 15, color: "#0f172a", fontWeight: 600 }}
                >
                  {subject}
                </Text>
              </div>

              <div>
                <Text
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}
                >
                  Message
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#0f172a",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message}
                </Text>
              </div>
            </div>
          </Section>

          <Section
            style={{
              marginTop: 18,
              borderTop: "1px solid #e6edf3",
              paddingTop: 12,
            }}
          >
            <Text style={{ fontSize: 13, color: "#94a3b8" }}>
              Reply to the user at:{" "}
              <Link href={`mailto:${email}`}>{email}</Link>
            </Text>
          </Section>

          <Section style={{ marginTop: 18 }}>
            <Text style={{ fontSize: 13, color: "#94a3b8" }}>
              — International Dance Nigeria
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export type { ContactEmailProps };
export default ContactEmail;
