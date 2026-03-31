"use client";

import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function NotificationButton() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchUnread = async () => {
    const res = await fetch("/api/notifications/unread");
    const data = await res.json();

    if (data.count > prevCountRef.current && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    prevCountRef.current = data.count;
    setCount(data.count);
  };

  useEffect(() => {
    audioRef.current = new Audio("/mixkit-long-pop-2358.wav");
  }, []);

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(fetchUnread, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => audioRef.current?.play()} // 🔊 test click
    >
      <Bell className="w-5 h-5" />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white px-1.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

