import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import ContactEmail from "@/components/emails/ContactEmail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = (await req.json()) as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    console.log({ name, email, subject, message });

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "International Dance Nigeria <contact@internationaldance.ng>",
      to: "info@internationaldance.ng",
      // to: "alagbarason@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      react: ContactEmail({ name, email, subject, message }),
      replyTo: email,
    });

    if (error) {
      console.log("Resend error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("Resend response data:", data);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// (
//         <ContactEmail
//           name={name}
//           email={email}
//           subject={subject}
//           message={message}
//         />
//       )
