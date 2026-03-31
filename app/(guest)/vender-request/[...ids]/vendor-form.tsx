"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Requirement } from "@/types";

type RequirementItem = {
  name: string;
  quantity: number;
  price: number;
};

export default function VendorForm({
  requirement,
  vendorId,
}: {
  requirement: Requirement;
  vendorId: string;
}) {

  
  let parsedConfig: any[] = [];
  try {
    parsedConfig = JSON.parse(requirement.configuration as any);
  } catch {
    parsedConfig = [];
  }

  const [items, setItems] = useState<RequirementItem[]>(
    parsedConfig.map((item: any) => ({
      name: item.item || "",
      quantity: Number(item.quantity) || 1,
      price: 0,
    }))
  );

  const [validTill, setValidTill] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [gst, setGst] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

   
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const gstAmount = (subtotal * gst) / 100;
  const grandTotal = subtotal + gstAmount + additionalCharges;

  const handleItemChange = (index: number, value: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, price: value } : item
      )
    );
  };

  
  const handleSubmit = async () => {
    try {
      if (!validTill) {
        alert("Please select quotation valid date");
        return;
      }

      setLoading(true);

      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId,
          requirementId: requirement.id,
          items,
          validTill: new Date(validTill),
          deliveryDays: Number(deliveryDays),
          paymentTerms,
          gst,
          additionalCharges,
          subtotal,
          gstAmount,
          grandTotal,
          remarks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      alert("Quotation submitted successfully 🎉");

   
      setValidTill("");
      setDeliveryDays("");
      setPaymentTerms("");
      setGst(0);
      setAdditionalCharges(0);
      setRemarks("");

    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex justify-center p-6">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Vendor Quotation Submission
          </CardTitle>
          <CardDescription>
            Vendor ID: {vendorId}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={requirement.manufatured ?? ""} readOnly />
            <Input value={requirement.model ?? ""} readOnly />
            <Input value={requirement.warranty ?? ""} readOnly />
            <Input value={requirement.warrantyType ?? ""} readOnly />
          </div>

        
          <div>
            <h3 className="font-semibold mb-4">Requirements</h3>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 mb-3 items-center"
              >
                <Input value={item.name} readOnly />
                <Input value={item.quantity} readOnly />
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter price"
                  onChange={(e) =>
                    handleItemChange(index, Number(e.target.value))
                  }
                />
                <div className="font-medium">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

   
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              value={validTill}
              onChange={(e) => setValidTill(e.target.value)}
            />

            <Input
              type="number"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              placeholder="Delivery Days"
            />

            <Input
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="Payment Terms"
            />

            <Input
              type="number"
              value={gst}
              onChange={(e) => setGst(Number(e.target.value))}
              placeholder="GST %"
            />

            <Input
              type="number"
              value={additionalCharges}
              onChange={(e) =>
                setAdditionalCharges(Number(e.target.value))
              }
              placeholder="Additional Charges"
            />
          </div>
 
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks"
          />

     
          <div className="text-right space-y-1 font-medium">
            <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div>GST: ₹{gstAmount.toFixed(2)}</div>
            <div className="text-lg font-bold">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>

         
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Quotation"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
