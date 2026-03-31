import { prisma } from "@/lib/db/prisma-helper";
import DeviceHistoryClient from "./device-history-client";

export default async function DeviceHistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assignedId?: string | string[] }>;
}) {

  const { id: deviceId } = await params;
  const sp = await searchParams;

  const assignedId =
    typeof sp?.assignedId === "string"
      ? sp.assignedId
      : undefined;


  const history = await prisma.deviceHistory.findMany({
    where: {
      deviceId: deviceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const repair = await prisma.deviceRepair.findFirst({
    where: {
      deviceId: deviceId,
      status: "REPAIRING",
    },
  });

  const repairs = await prisma.deviceRepair.findMany({
  where: {
    deviceId: deviceId,
  },
  orderBy: {
    createdAt: "desc",
  },
  });

  const assignments = await prisma.deviceAssigned.findMany({
  where: {
    deviceId: deviceId,
  },
  include: {
    employee: true,
  },
  orderBy: {
    assignedDate: "desc",
  },
});

  const device = await prisma.device.findUnique({
    where: {
      id: deviceId,
    },
  });

  let assigned = null;

  if (assignedId) {
    assigned = await prisma.deviceAssigned.findUnique({
      where: {
        id:(assignedId),
      },
      include: {
        employee: true,
      },
    });
  }

  return (
    <DeviceHistoryClient
      history={history}
      deviceId={deviceId}
      repair={repair}
      device={device}
      assigned={assigned}
      repairs={repairs}
      assignments={assignments}
    />
  );
}
