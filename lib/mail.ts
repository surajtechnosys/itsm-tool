import nodemailer from "nodemailer";
// import { prisma } from "@/lib/db/prisma-helper";
import { prisma } from "@/lib/db/prisma-helper";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const config = await prisma.configuration.findFirst();

  if (!config) {
    throw new Error("Email configuration not set");
  }

  const transport = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });

  return transport.sendMail({
    from: `Asset Management <${config.fromEmail}>`,
    to,
    subject,
    html,
  });
}
