"use client";

import { departmentSchema } from "@/lib/validators";
import { Department } from "@/types";
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
import { Textarea } from "../ui/textarea";
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
import { createDepartment, updateDepartment } from "@/lib/actions/department";

type FormValues = z.infer<typeof departmentSchema>;

const DepartmentForm = ({
  data,
  update = false,
}: {
  data?: Department;
  update: boolean;
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: data?.name ?? "",
      code: data?.code ?? "",
      description: data?.description ?? "",
      status: data?.status ?? "ACTIVE",
    },
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    console.log("SUBMIT:", values);

    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateDepartment(values, id);
      } else {
        res = await createDepartment(values);
      }

      if (!res?.success) {
        toast.error("Error", { description: res?.message });
      } else {
        toast.success("Success", { description: res?.message });
        router.push("/admin/department");
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
                <FormLabel>Department Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CODE */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department Code</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* STATUS */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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

        </div>

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className="h-40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader className="animate-spin w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default DepartmentForm;