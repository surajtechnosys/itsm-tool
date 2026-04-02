"use client";

import { assignedAssetDefaultValues } from "@/lib/constants";
import { assignedAssetSchema } from "@/lib/validators";
import { AssetType, AssignedAsset, Employee } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { ArrowRight, CalendarIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import {  Status } from "@prisma/client";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  createAssignedAsset,
  updateAssignedAsset,
} from "@/lib/actions/assigned-asset-action";

const ASSIGNMENT_STATUS = ["ASSIGNED", "RETURNED"];

const AssignedAssetForm = ({
  data,
  update = false,
  assets,
  employees,
}: {
  data?: AssignedAsset;
  update: boolean;
  assets: AssetType[];
  employees: Employee[];
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<z.infer<typeof assignedAssetSchema>>({
    resolver: zodResolver(assignedAssetSchema),
    defaultValues: data || assignedAssetDefaultValues,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof assignedAssetSchema>> = async (
    values: any
  ) => {
    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateAssignedAsset(values, id);
      } else {
        res = await createAssignedAsset(values);
      }

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
      } else {
        router.push("/admin/assigned-asset");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log(errors)
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* 🔁 ASSET */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="assetId"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof assignedAssetSchema>,
                  "assetId"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Asset</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(v) => field.onChange(v as string)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets.map(
                          (asset) =>
                            asset.id && (
                              <SelectItem key={asset.id} value={asset.id}>
                                {asset.name} ({asset.assetCode})
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* EMPLOYEE */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="employeeId"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof assignedAssetSchema>,
                  "employeeId"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(v) => field.onChange(v as string)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(
                          (employee) =>
                            employee.id && (
                              <SelectItem
                                key={employee.id}
                                value={employee.id}
                              >
                                {employee.first_name} {employee.last_name}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* DATE */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="assignedDate"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof assignedAssetSchema>,
                  "assignedDate"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Assigned Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value as Date}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="status"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof assignedAssetSchema>,
                  "status"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(v) => field.onChange(v as Status)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSIGNMENT_STATUS.map((status: string, index: number) => (
                          <SelectItem value={status} key={index}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* REMARKS */}
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="remarks"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof assignedAssetSchema>,
                "remarks"
              >;
            }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={20}
                    className="h-40"
                    placeholder="Enter Remarks"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SUBMIT */}
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}{" "}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignedAssetForm;
