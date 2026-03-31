import { Laptop } from "lucide-react";

type Props = {
  total: number;
  assigned: number;
  available: number;
};

export default function DeviceStatusCard({
  total,
  assigned,
  available,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Devices Overview</p>
        <Laptop className="w-5 h-5 text-blue-500" />
      </div>

      <h2 className="text-3xl font-bold mt-3">{total}</h2>
      <p className="text-xs text-gray-400">Total Devices</p>

      <div className="mt-4 flex justify-between">
        <div>
          <p className="text-xs text-gray-400">Assigned</p>
          <p className="text-lg font-semibold text-black">{assigned}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Available</p>
          <p className="text-lg font-semibold text-black">{available}</p>
        </div>
      </div>
    </div>
  );
}