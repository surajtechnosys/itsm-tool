"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  assigned: number;
  available: number;
};

export default function DeviceChart({ assigned, available }: Props) {
  const total = assigned + available;

  const data = [
    { name: "Assigned", value: assigned },
    { name: "Available", value: available },
  ];

  const COLORS = ["#8cabef", "#9ff5ee"]; // black + gray

  const getPercentage = (value: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(0);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      
      {/* Title */}
      <p className="text-sm text-gray-500 mb-6">
        Device Distribution
      </p>

      {/* Chart */}
      <div className="relative w-full h-80 flex items-center justify-center">
        
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={90}
              outerRadius={130}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                  className="hover:opacity-80 transition"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-400">Total Devices</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-10 mt-6 text-sm">
        
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-900"></span>
          <span>
            Assigned ({assigned}) — {getPercentage(assigned)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
          <span>
            Available ({available}) — {getPercentage(available)}%
          </span>
        </div>

      </div>

    </div>
  );
}