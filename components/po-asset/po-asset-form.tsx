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

import { createPOAsset } from "@/lib/actions/po-asset";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormValues } from "@/types";
import { poAssetSchema } from "@/lib/validators";

const defaultValues: FormValues = {
  endClientId: "",
  purchaseOrderId: "",

  make: "",
  model: "",
  serialNumber: "",

  startDate: "",
  endDate: "",

  sla: "",

  pincode: "",
  city: "",
  state: "",
  address: "",
};

const POAssetForm = ({
  endClients = [],
  purchaseOrders = [],
}: {
  endClients?: any[];
  purchaseOrders?: any[];
}) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(poAssetSchema), // ✅ FIXED
    defaultValues,
  });

  const Asset_TYPES = [
    "Server",
    "Storage",
    "Network",
    "Security",
    "Desktop",
    "Printer",
    "Peripherals",
    "VC",
    "Loadsamples",
    "Others",
  ];

  const [isPending, startTransition] = React.useTransition();

  // 🔥 Watch EndClient → filter PO
  const selectedEndClient = form.watch("endClientId");

  const filteredPOs = purchaseOrders.filter(
    (po) => po.endClientId === selectedEndClient,
  );

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(async () => {
      const res = await createPOAsset(values);

      if (!res?.success) {
        toast.error(res?.message);
      } else {
        toast.success("Created");
        router.refresh();
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
                <FormLabel>End Clients</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("purchaseOrderId", ""); // reset PO
                    }}
                  >
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
            name="purchaseOrderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!selectedEndClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPOs.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.poNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Make */}
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Model */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Serial Number */}
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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

          {/* SLA */}
          <FormField
            control={form.control}
            name="sla"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SLA</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* asset Type */}
          <FormField
            control={form.control}
            name="poType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {Asset_TYPES.map((type) => (
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

          {/* Pincode */}
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* State */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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

export default POAssetForm;
