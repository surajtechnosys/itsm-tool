"use client";

import { designationSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Status } from "@/lib/generated/prisma/enums";

import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createDesignation, updateDesignation } from "@/lib/actions/designation";

type FormValues = z.infer<typeof designationSchema>;

export default function DesignationForm({ data, update = false }: any) {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: data?.name ?? "",
      code: data?.code ?? "",
      level: data?.level ?? 1,
      description: data?.description ?? "",
      status: data?.status ?? "ACTIVE",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    let res;

    if (update && id) {
      res = await updateDesignation(values, id);
    } else {
      res = await createDesignation(values);
    }

    if (!res?.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      router.push("/admin/designation");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid grid-cols-4 gap-4">

          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Designation Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="code" render={({ field }) => (
            <FormItem>
              <FormLabel>Designation Code</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="level" render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                  <SelectItem value={Status.INACTIVE}>Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />

        </div>

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value ?? ""} />
            </FormControl>
          </FormItem>
        )} />

        <Button type="submit">Submit</Button>

      </form>
    </Form>
  );
}