import nodemailer from "nodemailer";

export async function sendResetEmail(to, resetLink) {
  if (!process.env.SMTP_HOST) {
    console.log("[DEV] Reset password link:", resetLink);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@restaurant-reservations.local",
    to,
    subject: "Reset your password",
    text: `Reset your password using this link: ${resetLink}`,
    html: `<p>Reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
}
