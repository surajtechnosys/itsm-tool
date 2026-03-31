import { AlertTriangle } from "lucide-react";

export function ExpiredCard({ count }: { count: number }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Expired Assets</p>
        <AlertTriangle className="w-5 h-5 text-red-500" />
      </div>

      <h2 className="text-3xl font-bold mt-4 text-black">
        {count}
      </h2>
    </div>
  );
}