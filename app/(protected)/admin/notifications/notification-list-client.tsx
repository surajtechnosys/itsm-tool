"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
const FILTERS = [
  "ALL",
  "DEVICE_CREATE",
  "USER_CREATE",
  "WARRANTY",
  "DEVICE_ASSIGN",
  "DEVICE_RETURN",
];

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationListClient({ notifications }: any) {
  const router = useRouter();

  const [filter, setFilter] = useState("ALL");
  const filteredNotifications =
    filter === "ALL"
      ? notifications
      : notifications.filter((n: any) => n.type === filter);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  };

  const handleClick = async (n: any) => {
    await markAsRead(n.id);

    if (n.deviceId) {
      router.push(`/admin/device/${n.deviceId}/history`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Filter Notifications
        </h2>

        <Select value={filter} onValueChange={(val) => setFilter(val)}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>

          <SelectContent>
            {FILTERS.map((f) => (
              <SelectItem key={f} value={f}>
                {f.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filteredNotifications.map((n: any) => (
        <div
          key={n.id}
          onClick={() => handleClick(n)}
          className={`border rounded-md p-4 cursor-pointer transition-all duration-200
            ${!n.isRead ? "bg-blue-500/10 border-blue-500/40" : "bg-background"}
            hover:bg-blue-500/20 hover:border-blue-500/60
          `}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!n.isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
              <h2 className="font-medium">{n.title}</h2>
            </div>

            <span className="text-xs text-muted-foreground">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mt-1">{n.message}</p>

          <span className="text-xs mt-2 inline-block px-2 py-1 rounded bg-primary/20">
            {n.type}
          </span>
        </div>
      ))}
    </div>
  );
}
