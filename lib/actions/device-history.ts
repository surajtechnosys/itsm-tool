"use server"

import { prisma } from "@/lib/db/prisma-helper"

export async function getDeviceHistory(deviceId: string) {

  return prisma.deviceHistory.findMany({
    where: {
      deviceId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

}