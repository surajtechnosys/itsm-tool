import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();

  for (const [key, value] of formData.entries()) {
  }

  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ message: "No image uploaded" }, { status: 400 });
  }

  // Validate type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Invalid file type" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads/user");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop();
  const filename = `${crypto.randomUUID()}.${ext}`;

  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({
    success: true, 
    url: `/uploads/user/${filename}`,
  });
}
