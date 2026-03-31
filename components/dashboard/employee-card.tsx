import { Users } from "lucide-react";

export function EmployeeCard({ count }: { count: number }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Employees</p>
        <Users className="w-5 h-5 text-gray-500" />
      </div>

      {/* Main Value */}
      <h2 className="text-3xl font-bold mt-4 text-gray-900">
        {count}
      </h2>

      {/* Subtext */}
      <p className="text-xs text-gray-400 mt-1">
        Total Active Employees
      </p>

    </div>
  );
}