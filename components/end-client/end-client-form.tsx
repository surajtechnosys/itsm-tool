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

import { createEndClient, updateEndClient } from "@/lib/actions/end-client";
import { endClientSchema } from "@/lib/validators";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormValues = z.infer<typeof endClientSchema>;

const defaultValues: FormValues = {
  name: "",
  endClientId: "",
  frontClientId: "",
  contactPerson: "",
  contactNumber: "",
  contactEmail: "",
  status: "Active",
};

const EndClientForm = ({
  data,
  update = false,
  frontClients = [],
}: {
  data?: any;
  update: boolean;
  frontClients?: { id: string; name: string; frontClientId: string }[];
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(endClientSchema),
    defaultValues: data || defaultValues,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateEndClient(values, id);
      } else {
        res = await createEndClient(values);
      }

      if (!res?.success) {
        toast.error("Error", { description: res?.message });
      } else {
        toast.success("Success");
        router.push("/admin/end-client");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit, (e) =>
          console.log("ERRORS:", e)
        )}
      >
        <div className="grid grid-cols-2 gap-4">

          {/* Front Client */}
          <FormField
            control={form.control}
            name="frontClientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Front Client</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {frontClients.map((fc) => (
                        <SelectItem
                          key={fc.id}
                          value={fc.frontClientId}
                        >
                          {fc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Person */}
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Client ID */}
          <FormField
            control={form.control}
            name="endClientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Client ID</FormLabel>
                <FormControl>
                  <Input placeholder="EC001" {...field} />
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
                  <Select
                    value={field.value || "Active"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EndClientForm;