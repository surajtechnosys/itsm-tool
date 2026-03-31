import { getDashboardStats } from "@/lib/actions/dashboard-action";
import StatsCard from "@/components/dashboard/stats-card";
import { CostCard } from "@/components/dashboard/cost-card";
import DeviceStatusCard from "@/components/dashboard/device-status-card";
import { ExpiredCard } from "@/components/dashboard/expired-card";
import { EmployeeCard } from "@/components/dashboard/employee-card";
import DeviceChart from "@/components/dashboard/device-chart";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <DeviceStatusCard
          total={stats.totalDevices}
          assigned={stats.assignedDevices}
          available={stats.availableDevices}
        />
        <CostCard value={stats.totalPurchaseCost} />

        <ExpiredCard count={stats.expiredDevices} />

        <EmployeeCard count={stats.totalEmployees} />
        
        <div className="md:col-span-2">
        <DeviceChart
          assigned={stats.assignedDevices}
          available={stats.availableDevices}
        />
        </div>
      </div>
    </div>
  );
}
