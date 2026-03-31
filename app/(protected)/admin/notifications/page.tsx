import { prisma } from "@/lib/db/prisma-helper";
import NotificationListClient from "./notification-list-client";

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">All Notifications</h1>

      <NotificationListClient notifications={notifications} />
    </div>
  );
}