"use client";

import { locationSchema } from "@/lib/validators";
import { Location } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Status } from "@/lib/generated/prisma/enums";
import { locationDefaultValues } from "@/lib/constants";
import { createLocation, updateLocation } from "@/lib/actions/location";

type FormValues = z.infer<typeof locationSchema>;

const LocationForm = ({
  data,
  update = false,
}: {
  data?: Location;
  update: boolean;
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: data ?? locationDefaultValues,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log("SUBMIT DATA:", values); // debug

    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateLocation(values, id);
      } else {
        res = await createLocation(values);
      }

      if (!res?.success) {
        toast.error("Error", { description: res?.message });
      } else {
        router.push("/admin/location");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onSubmit, console.log)}
      >
        <div className="grid grid-cols-3 gap-4">
          {/* NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CODE ✅ FIXED */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Code</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* STATUS ✅ FIXED */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                    <SelectItem value={Status.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* ADDRESS */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    value={field.value ?? ""}
                    className="w-full border rounded-md p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CITY */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* STATE */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* COUNTRY */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* PINCODE */}
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CHECKBOX ✅ FIXED */}
          <FormField
            control={form.control}
            name="hasMultipleFloors"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mt-6">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value ?? false}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Has Multiple Floors</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader className="animate-spin w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          Save
        </Button>
      </form>
    </Form>
  );
};

export default LocationForm;
