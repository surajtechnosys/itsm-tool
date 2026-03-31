"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { returnDeviceAction } from "@/lib/actions/device-assigned-action";

export default function DeviceReturnForm({ assignedId, deviceId, onClose }: any) {

  const [damage, setDamage] = useState("NO");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = async () => {

    const res = await returnDeviceAction({
      assignedId,
      deviceId,
      damage,
      remarks
    });

    if (res.success) {
      window.location.reload();
    }

  };

  return (
    <div className="border p-4 rounded space-y-4">

      <h3 className="font-semibold">Return Device</h3>

      <div>
        <label>Damage</label>
        <select
          className="border p-2 rounded w-full"
          value={damage}
          onChange={(e) => setDamage(e.target.value)}
        >
          <option value="NO">No</option>
          <option value="YES">Yes</option>
        </select>
      </div>

      <div>
        <label>Remarks</label>
        <textarea
          className="border p-2 rounded w-full"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit}>Returned</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>

    </div>
  );
}