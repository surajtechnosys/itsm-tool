import { getNotifications } from "@/lib/actions/notification-action"
import { checkWarrantyExpiry } from "@/lib/cron/warranty-check"
import { shouldRunWarrantyCheck } from "@/lib/utils/warranty-runner"
import { NextResponse } from "next/server"

export async function GET() {

  if (shouldRunWarrantyCheck()) {
    await checkWarrantyExpiry()
  }

  const data = await getNotifications()
  return NextResponse.json(data)
}
