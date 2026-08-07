import { Resend } from "resend";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(input: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return { sent: false, skipped: true as const };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    if (error) {
      console.error("Resend error:", error);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

export function getStaffNotificationEmail() {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL ??
    process.env.EMAIL_FROM ??
    "alphabfellowship7@gmail.com"
  );
}

export async function notifyStaff(subject: string, html: string) {
  return sendEmail({
    to: getStaffNotificationEmail(),
    subject: `[Alpha Fellowship] ${subject}`,
    html,
    text: html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  });
}
