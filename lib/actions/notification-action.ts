import { prisma } from "@/lib/db/prisma-helper"

export async function createNotification(data: {
  title: string
  message: string
  type: "DEVICE_ASSIGN" | "REPAIR" | "WARRANTY" | "DEVICE_CREATE" | "USER_CREATE" | "DEVICE_RETURN"
  deviceId?: string
  triggerDay?: number 
}) {
  return prisma.notification.create({
    data,
  })
}

export async function getNotifications() {
  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  })
}