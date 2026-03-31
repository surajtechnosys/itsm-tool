"use client";

import { useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getPurchaseOrderColumns } from "./purchaseOrder-columns";

export default function PurchaseOrderTable({
  data,
  canEdit,
  title,
  actions

}: any) {
  const [tableData, setTableData] = useState(data);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);

    try {
      const res = await fetch("/api/purchase-order", {
        method: "PUT", // ✅ MATCH YOUR API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // update UI locally
      setTableData((prev: any[]) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const columns = getPurchaseOrderColumns({
    canEdit,
    onSend: (id: string) => updateStatus(id, "SENT"),
    onReceive: (id: string) => updateStatus(id, "RECEIVED"),
    loadingId,
  });

  return <DataTable data={tableData} columns={columns} title={title} actions={actions} />;
}