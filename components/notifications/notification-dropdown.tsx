"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationButton() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  const fetchUnread = async () => {
    const res = await fetch("/api/notifications/unread");
    const data = await res.json();
    setCount(data.count);
  };

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data.slice(0, 5));
  };

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(() => {
      fetchUnread();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return; // only run when dropdown is open

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, [open]);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    fetchUnread();
  };

  const markAllAsRead = async () => {
    await fetch("/api/notifications/read-all", {
      method: "POST",
    });

    fetchNotifications();
    fetchUnread(); // refresh dropdown
  };

  const handleClick = async (n: any) => {
    await markAsRead(n.id);

    if (n.deviceId) {
      router.push(`/admin/device/${n.deviceId}/history`);
    }
  };

  const toggleDropdown = () => {
    setOpen(!open);
    if (!open) fetchNotifications();
  };

  return (
    <div className="relative">
      <div onClick={toggleDropdown} className="cursor-pointer relative">
        <Bell className="w-5 h-5" />

        {count > 0 && (
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1.5 rounded-full">
            {count}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-background border rounded-md shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-medium">Notifications</span>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-500 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No notifications
              </p>
            ) : (
              notifications.map((n: any) => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`p-3 border-b cursor-pointer transition
                    ${!n.isRead ? "bg-blue-500/10" : ""}
                    hover:bg-blue-500/20
                  `}
                >
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    <span className="text-sm font-medium">{n.title}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div
            onClick={() => router.push("/admin/notifications") }
            className="p-2 text-center text-sm text-blue-500 cursor-pointer hover:underline"
          >
            See all
          </div>
        </div>
      )}
    </div>
  );
}
