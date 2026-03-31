import { prisma } from "@/lib/db/prisma-helper"
import { createNotification } from "@/lib/actions/notification-action"

export async function checkWarrantyExpiry() {
  const devices = await prisma.device.findMany({
    where: {
      warrantyEnd: {
        not: null,
      },
    },
  })

  const today = new Date()

  for (const device of devices) {
    if (!device.warrantyEnd) continue

    const diffTime =
      new Date(device.warrantyEnd).getTime() - today.getTime()

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const shouldNotify =
      diffDays <= 16 &&
      diffDays > 0 &&
      diffDays % 2 === 0

    if (!shouldNotify) continue

    const existing = await prisma.notification.findFirst({
      where: {
        deviceId: device.id,
        type: "WARRANTY",
        triggerDay: diffDays, 
      },
    })

    if (existing) continue

    await createNotification({
      title: "Warranty Expiring Soon",
      message: `${device.name} warranty expires in ${diffDays} days`,
      type: "WARRANTY",
      deviceId: device.id,
      triggerDay: diffDays,
    })
  }
}