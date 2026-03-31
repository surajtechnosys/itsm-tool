"use client";

import { useState, useEffect } from "react";
import { Trash2, Eye, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

import { createPurchaseOrder } from "@/lib/actions/purchase-order";
import { getRequirement } from "@/lib/actions/requirements";
import { getVendors } from "@/lib/actions/vendor";
import { getDeviceCategory } from "@/lib/actions/device-category-action";
import { useRouter } from "next/navigation";


type POItem = {
  deviceCategoryId: string;
  quantity: number;
  unitPrice: number;
};

export default function CreatePurchaseOrderPage() {
  const router = useRouter();

  const [requirements, setRequirements] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [deviceCategories, setDeviceCategories] = useState<any[]>([]);

  const [requirementId, setRequirementId] = useState("");
  const [vendorId, setVendorId] = useState("");

  const [items, setItems] = useState<POItem[]>([
    { deviceCategoryId: "", quantity: 1, unitPrice: 0 }
  ]);

  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const load = async () => {
      const req = await getRequirement();
      const ven = await getVendors();
      const cat = await getDeviceCategory();

      setRequirements(req);
      setVendors(ven);
      setDeviceCategories(cat);
    };

    load();
  }, []);


  const addItem = () => {
    if (readOnly) return;
    setItems([...items, { deviceCategoryId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1 || readOnly) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof POItem,
    value: string | number
  ) => {
    if (readOnly) return;
    const updated = [...items];
    updated[index][field] = value as never;
    setItems(updated);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleCreatePO = async () => {
    if (!requirementId || !vendorId) {
      alert("Please select requirement and vendor");
      return;
    }

    try {
      setLoading(true);

      await createPurchaseOrder({
        requirementId,
        vendorId,
        items,
      });

      alert("Purchase Order Created");

      router.push("/admin/purchase-order"); 
    } catch (error) {
      alert("Failed to create PO");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setReadOnly(!readOnly)}
        >
          {readOnly ? <Pencil size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      {/* DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">

          <Input disabled placeholder="PO Number (auto-generated)" />

          <Select disabled={readOnly} onValueChange={setRequirementId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Requirement *" />
            </SelectTrigger>
            <SelectContent>
              {requirements.map((req) => (
                <SelectItem key={req.id} value={req.id}>
                  {req.model || req.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select disabled={readOnly} onValueChange={setVendorId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor *" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </CardContent>
      </Card>

      {/* ITEMS */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-center">

              <Select
                disabled={readOnly}
                value={item.deviceCategoryId}
                onValueChange={(value) =>
                  updateItem(index, "deviceCategoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  {deviceCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={item.quantity}
                disabled={readOnly}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
              />

              <Input
                type="number"
                value={item.unitPrice}
                disabled={readOnly}
                onChange={(e) =>
                  updateItem(index, "unitPrice", Number(e.target.value))
                }
              />

              <div>₹{item.quantity * item.unitPrice}</div>

              {!readOnly && (
                <Button
                  variant="destructive"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          ))}

          {!readOnly && (
            <Button variant="outline" onClick={addItem}>
              + Add Item
            </Button>
          )}

        </CardContent>
      </Card>

      {/* TOTAL */}
      <Card>
        <CardContent className="flex justify-between py-6">
          <span>Total</span>
          <span className="font-bold">₹{totalAmount}</span>
        </CardContent>
      </Card>

      {!readOnly && (
        <div className="flex justify-end">
          <Button onClick={handleCreatePO} disabled={loading}>
            {loading ? "Creating..." : "Create Purchase Order"}
          </Button>
        </div>
      )}
    </div>
  );
}
