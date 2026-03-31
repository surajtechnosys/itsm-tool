"use server";

import { prisma } from "../db/prisma-helper";
import { sendMail } from "../mail";
import { requirementEmailTemplate } from "../requirement-template";

import { vendorRequestSchema } from "../validators";

export async function submitVendorRequest(
  data: unknown,
  vendorId: string
) {
  const parsed = vendorRequestSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid vendor request data");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    select: {
      name: true,
      email: true,
    },
  });

  if (!vendor) {
    throw new Error("Vendor not found");
  }

  if (!vendor.email) {
    throw new Error("Vendor email not found");
  }

  const vendorName = vendor.name;

  const {
    manufatured,
    model,
    configuration,
    warranty,
    warrantyType,
    quotationValidity,
    price,
    remarks,
  } = parsed.data;

  const requirement = await prisma.requirement.create({
    data: {
      manufatured,
      model,
      configuration: configuration
        ? JSON.parse(configuration)
        : null,
      warranty,
      warrantyType,
      quotationValidity,
    },
  });



  await sendMail({
    to: vendor.email, 
    subject: "Asset Request – Quotation Required",
    html: requirementEmailTemplate({
      model,
      manufatured,
      warranty,
      warrantyType,
      quotationValidity,
      configuration: configuration ? JSON.parse(configuration) : [],
      vendorName,
      vendorId,
      requirementId: requirement.id,
    }),
  });

  return { success: true };
}
