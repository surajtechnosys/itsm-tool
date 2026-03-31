"use client";

import { useEffect, useState } from "react";

export default function NotificationList() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000); // every 10s

    return () => clearInterval(interval);
  }, []);

  function fetchNotifications() {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then(setData);
  }

  return (
    <div className="max-h-60 overflow-y-auto">
      {data.map((item) => (
        <div key={item.id} className="p-3 border-b">
          <p>{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.message}</p>
        </div>
      ))}
    </div>
  );
}
