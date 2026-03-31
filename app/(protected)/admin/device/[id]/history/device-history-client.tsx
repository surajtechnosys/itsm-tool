"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DeviceRepairForm from "@/components/device/device-repair-form";
import { completeDeviceRepair } from "@/lib/actions/device-repair-action";
import DeviceReturnForm from "@/components/device/device-return-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DeviceHistoryClient({
  history,
  deviceId,
  repair,
  device,
  assigned,
  repairs,
  assignments,
}: any) {
  const [showRepair, setShowRepair] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [showCrux, setShowCrux] = useState(false);
  const router = useRouter();
  const totalRepairCost =
    repairs?.reduce((sum: number, r: any) => sum + (r.cost || 0), 0) || 0;

  const repairCount = repairs?.length || 0;
  const repairChartData =
    repairs?.map((r: any) => ({
      name: new Date(r.createdAt).toLocaleDateString(),
      cost: r.cost,
    })) || [];

  const assignmentChartData = Object.values(
    assignments?.reduce((acc: any, a: any) => {
      const name = a.employee.first_name;

      if (!acc[name]) {
        acc[name] = { name, count: 0 };
      }

      acc[name].count += 1;

      return acc;
    }, {}) || {},
  );

  const isAssignedView = !!assigned;

  const employeeCount = assignments?.length || 0;
  const purchaseDate = device?.createdAt
    ? new Date(device.createdAt).toLocaleDateString()
    : "-";

  const completeRepair = async () => {
    if (!repair) return;

    const res = await completeDeviceRepair(repair.id, deviceId);

    if (res.success) {
      router.refresh();
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";

      case "RETURNED":
        return "bg-green-100 text-green-700";

      case "REPAIR_SENT":
        return "bg-orange-100 text-orange-700";

      case "REPAIR_COMPLETED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mt-2 p-2 space-y-2 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex gap-10 bg-muted/40 p-3 rounded-md text-sm">
        <div>
          <span className="text-muted-foreground">Device</span>
          <p className="font-medium">{device.name}</p>
        </div>

        <div>
          <span className="text-muted-foreground">Model</span>
          <p className="font-medium">{device.model}</p>
        </div>

        {assigned && (
          <>
            <div>
              <span className="text-muted-foreground">Assigned To</span>
              <p className="font-medium">{assigned.employee.first_name}</p>
            </div>

            <div>
              <span className="text-muted-foreground">Assigned Date</span>
              <p className="font-medium">
                {new Date(assigned.assignedDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-start">
        <h1 className="text-xl font-semibold">Device History</h1>

        <div className="flex flex-col gap-2">
          {device.deviceState === "REPAIR" ? (
            <Button onClick={completeRepair}>Complete Repair</Button>
          ) : assigned ? (
            <Button
              onClick={() => {
                setShowRepair(false);
                setShowReturn(true);
              }}
            >
              Return Device
            </Button>
          ) : (
            <Button
              onClick={() => {
                setShowReturn(false);
                setShowRepair(true);
              }}
            >
              Send To Repair
            </Button>
          )}

          <Button variant="outline" onClick={() => setShowCrux(!showCrux)}>
            Crux
          </Button>
        </div>
      </div>
      <div
        className={`grid ${showRepair || showReturn ? "grid-cols-2" : "grid-cols-1"} gap-6`}
      >
        {showRepair && (
          <DeviceRepairForm
            deviceId={deviceId}
            onClose={() => setShowRepair(false)}
          />
        )}
        {showReturn && (
          <DeviceReturnForm
            assignedId={assigned?.id}
            deviceId={deviceId}
            onClose={() => setShowReturn(false)}
          />
        )}


        <div>
          {!showCrux && (
            <div className="space-y-6 max-h-[75vh] overflow-y-auto">
              {history.length === 0 && <p>No history found for this device.</p>}

              {history.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                    <div className="w-px bg-border flex-1"></div>
                  </div>

                  <div className="border rounded-md p-4 w-full bg-background">
                    <div className="flex justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(
                          item.actionType,
                        )}`}
                      >
                        {item.actionType}
                      </span>

                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {item.notes && (
                      <p className="text-sm mt-2 text-muted-foreground">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {showCrux && (
            <div className="w-full border rounded-md p-6 bg-background">
              <h3 className="font-semibold mb-6 text-lg">Device Analytics</h3>

              <ResizablePanelGroup direction="horizontal" className="h-[600px]">
                <ResizablePanel defaultSize={50} minSize={5}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Repair Cost Chart</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col h-[520px]">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Repair Cost
                          </p>
                          <p className="font-semibold text-lg">
                            ₹{totalRepairCost}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Repairs
                          </p>
                          <p className="font-semibold text-lg">{repairCount}</p>
                        </div>
                      </div>

                      <div className="h-60 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={repairChartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="repairGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#3b82f6"
                                  stopOpacity={0.9}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#60a5fa"
                                  stopOpacity={0.6}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              stroke="#e5e7eb"
                              strokeDasharray="4 4"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="name"
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              cursor={{ fill: "#f3f4f6" }}
                              contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                fontSize: "13px",
                              }}
                            />
                            <Bar
                              dataKey="cost"
                              fill="url(#repairGradient)"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground mb-2">
                        <div>Vendor</div>
                        <div>Repair Date</div>
                        <div>Return Date</div>
                        <div>Duration</div>
                        <div>Amount</div>
                      </div>

                      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                        {repairs?.map((r: any) => (
                          <div
                            key={r.id}
                            className="grid grid-cols-5 gap-2 text-sm"
                          >
                            <div className="border p-2 rounded">{r.vendor}</div>

                            <div className="border p-2 rounded">
                              {new Date(r.repairDate).toLocaleDateString()}
                            </div>

                            <div className="border p-2 rounded">
                              {r.completedAt
                                ? new Date(r.completedAt).toLocaleDateString()
                                : "-"}
                            </div>

                            <div className="border p-2 rounded">
                              {r.completedAt
                                ? `${Math.ceil(
                                    (new Date(r.completedAt).getTime() -
                                      new Date(r.repairDate).getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  )} days`
                                : "-"}
                            </div>

                            <div className="border p-2 rounded">₹{r.cost}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-border hover:bg-primary/30 cursor-col-resize transition-colors rounded" />

                {/* ASSIGNMENT CHART */}
                <ResizablePanel defaultSize={50} minSize={5}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Assignment History</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col h-[520px]">
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Purchase Date
                          </p>
                          <p className="font-semibold text-lg">
                            {new Date(device.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">
                            Employees
                          </p>
                          <p className="font-semibold text-lg">
                            {assignments?.length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="h-60 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={assignmentChartData}
                            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="assignmentGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#10b981"
                                  stopOpacity={0.9}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#6ee7b7"
                                  stopOpacity={0.6}
                                />
                              </linearGradient>
                            </defs>

                            <CartesianGrid
                              stroke="#e5e7eb"
                              strokeDasharray="4 4"
                              vertical={false}
                            />

                            <XAxis
                              type="number"
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                              axisLine={false}
                              tickLine={false}
                            />

                            <YAxis
                              dataKey="name"
                              type="category"
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                              axisLine={false}
                              tickLine={false}
                            />

                            <Tooltip
                              cursor={{ fill: "#f3f4f6" }}
                              contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e5e7eb",
                                fontSize: "13px",
                              }}
                            />

                            <Bar
                              dataKey="count"
                              fill="url(#assignmentGradient)"
                              radius={[0, 8, 8, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground mb-2">
                        <div>Employee</div>
                        <div>Assigned Date</div>
                        <div>Return Date</div>
                        <div>Damage</div>
                      </div>

                      <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                        {assignments?.map((a: any) => (
                          <div
                            key={a.id}
                            className="grid grid-cols-4 gap-2 text-sm"
                          >
                            <div className="border p-2 rounded">
                              {a.employee.first_name}
                            </div>

                            <div className="border p-2 rounded">
                              {new Date(a.assignedDate).toLocaleDateString()}
                            </div>

                            <div className="border p-2 rounded">
                              {a.returnedDate
                                ? new Date(a.returnedDate).toLocaleDateString()
                                : "-"}
                            </div>

                            <div className="border p-2 rounded">{a.damage}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
