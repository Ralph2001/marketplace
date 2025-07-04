// app/api/send-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { to, subject, text, senderEmail, itemId } = body;

        if (!to || !subject || !text) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const itemUrl = `${process.env.NEXT_PUBLIC_APP_URL}/item/${itemId}`;

        const fullText = `
            You have a new message from ${senderEmail} regarding your listing.

            Message:
            ${text}

            View the item here:
            ${itemUrl}
                `;

        const data = await resend.emails.send({
            from: `Marketplace <marketplace@resend.dev>`,
            to,
            subject,
            text: fullText,
        });


        return NextResponse.json({ message: "Email sent successfully!", data });
    } catch (error) {
        console.error("Email send error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
};
