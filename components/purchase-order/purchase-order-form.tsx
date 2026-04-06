"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

import {
  createPurchaseOrder,
  updatePurchaseOrder,
} from "@/lib/actions/purchase-order";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

const purchaseOrderSchema = z.object({
  endClientId: z.string().min(1, "Required"),
  poNumber: z.string().min(1, "Required"),
  contactName: z.string().optional(),
  contactNumber: z.string().optional(),
  contactEmail: z.string().optional(),

  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  poReceiveDate: z.string().min(1, "Required"),

  employeeId: z.string().min(1, "Required"),
  poType: z.string().min(1, "Required"),

  status: z.string(),
  poValue: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof purchaseOrderSchema>;

const defaultValues: FormValues = {
  endClientId: "",
  poNumber: "",
  contactName: "",
  contactNumber: "",
  contactEmail: "",

  startDate: "",
  endDate: "",
  poReceiveDate: "",

  employeeId: "",
  poType: "",

  status: "Active",
  poValue: "",
};

const PO_TYPES = [
  "AMC (B2B)",
  "AMC (Skill)",
  "AMC (Spare)",
  "CAMC",
  "One Time Support",
  "Rental Service",
  "FMS",
  "Installation",
  "License",
  "Software",
  "Product",
];

const PurchaseOrderForm = ({
  data,
  update = false,
  endClients = [],
  employees = [],
}: {
  data?: any;
  update: boolean;
  endClients?: any[];
  employees?: any[];
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: data
      ? {
          ...data,

          // ✅ FIX: Date → string (for input type="date")
          startDate: data.startDate
            ? new Date(data.startDate).toISOString().split("T")[0]
            : "",

          endDate: data.endDate
            ? new Date(data.endDate).toISOString().split("T")[0]
            : "",

          poReceiveDate: data.poReceiveDate
            ? new Date(data.poReceiveDate).toISOString().split("T")[0]
            : "",

          // ✅ FIX: number → string
          poValue: data.poValue?.toString() || "",

          // ✅ safety defaults
          status: data.status || "Active",
          poType: data.poType || "",
          employeeId: data.employeeId || "",
          endClientId: data.endClientId || "",
        }
      : defaultValues,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updatePurchaseOrder(values, id);
      } else {
        res = await createPurchaseOrder(values);
      }

      if (!res?.success) {
        toast.error(res?.message);
      } else {
        toast.success("Success");
        router.push("/admin/purchase-order");
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          {/* End Client */}
          <FormField
            control={form.control}
            name="endClientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Client</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {endClients.map((ec) => (
                        <SelectItem key={ec.id} value={ec.id}>
                          {ec.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PO Number */}
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Name */}
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Contact Number */}
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Contact Email */}
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PO Receive Date */}
          <FormField
            control={form.control}
            name="poReceiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Receive Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Employee */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {`${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "No Name"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PO Type */}
          <FormField
            control={form.control}
            name="poType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {PO_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* PO Value */}
          <FormField
            control={form.control}
            name="poValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PurchaseOrderForm;
