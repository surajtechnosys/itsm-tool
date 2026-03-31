"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

// import { DataTable } from "@/components/common/DataTable";
import { DataTable } from "@/components/data-table";
import { getProcurementColumns } from "./procurement-columns";

import { getQuotations } from "@/lib/actions/quotation";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function ProcurementTable({
  canApprove,
  canReject,
  canDelete,
  title,
  actions
}: any) {
  const [data, setData] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const loadData = async () => {
    try {
      const res = await getQuotations();
      setData(res as any[]);
    } catch {
      toast.error("Failed to load quotations");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const confirmAction = (msg: string) => window.confirm(msg);

  const handleApprove = async (id: string) => {
    if (!confirmAction("Approve this quotation?")) return;

    setLoadingId(id);

    await fetch("/api/quotation/approve", {
      method: "POST",
      body: JSON.stringify({ quotationId: id }),
    });

    toast.success("Approved");
    await loadData();
    setLoadingId(null);
  };

  const handleReject = async (id: string) => {
    if (!confirmAction("Reject this quotation?")) return;

    setLoadingId(id);

    await fetch("/api/quotation/reject", {
      method: "POST",
      body: JSON.stringify({ quotationId: id }),
    });

    toast.success("Rejected");
    await loadData();
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirmAction("Delete this quotation?")) return;

    setLoadingId(id);

    await fetch("/api/quotation/delete", {
      method: "DELETE",
      body: JSON.stringify({ quotationId: id }),
    });

    toast.success("Deleted");
    await loadData();
    setLoadingId(null);
  };

  const filteredData =
    filter === "ALL"
      ? data
      : data.filter((item) => item.status === filter);

  const columns = getProcurementColumns({
    canApprove,
    canReject,
    canDelete,
    loadingId,
    onApprove: handleApprove,
    onReject: handleReject,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-4">
      {/* FILTER BUTTONS */}
      <div className="flex gap-2">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
          <button
            key={status}
            className={`px-3 py-1 border rounded ${
              filter === status ? "bg-black text-white" : ""
            }`}
            onClick={() => setFilter(status as StatusFilter)}
          >
            {status}
          </button>
        ))}
      </div>

      <DataTable data={filteredData} columns={columns} title={title} actions={actions} />
    </div>
  );
}
