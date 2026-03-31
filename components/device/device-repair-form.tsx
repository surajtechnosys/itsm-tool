"use client";

import { useState } from "react";
import { sendDeviceToRepair } from "@/lib/actions/device-repair-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeviceRepairForm({
  deviceId,
  onClose,
}: {
  deviceId: string;
  onClose: () => void;
}) {
  const [vendor, setVendor] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [repairDate, setRepairDate] = useState("");
  const router = useRouter();

  const submit = async () => {
    const res = await sendDeviceToRepair({
      deviceId,
      vendor,
      cost: Number(cost),
      notes,
      repairDate,
    });

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      router.refresh(); // refresh page data
      onClose(); // close form
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h2 className="font-semibold">Send Device To Repair</h2>

      <Input
        placeholder="Repair Vendor"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
      />

      <Input
        type="date"
        value={repairDate}
        onChange={(e) => setRepairDate(e.target.value)}
      />

      <Input
        placeholder="Repair Cost"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />

      <Input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button onClick={submit}>Submit</Button>
    </div>
  );
}
