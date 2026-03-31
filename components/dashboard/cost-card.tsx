import { IndianRupee } from "lucide-react";

export function CostCard({ value }: { value: number }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Total Asset Cost</p>
        <IndianRupee className="w-5 h-5 text-purple-500" />
      </div>

      <h2 className="text-3xl font-bold mt-4 text-black">
        ₹ {value.toLocaleString()}
      </h2>
    </div>
  );
}