"use client";

import { assignedDeviceDefaultValues } from "@/lib/constants";
import { deviceAssignedSchema } from "@/lib/validators";
import { Device, DeviceAssigned, Employee } from "@/types";
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
import { AssignedDeviceStatus, Status } from "@/lib/generated/prisma/enums";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  createAssignedDevice,
  updateAssingedDevice,
} from "@/lib/actions/device-assigned-action";

const DeviceAssignedForm = ({
  data,
  update = false,
  devices,
  employees,
}: {
  data?: DeviceAssigned;
  update: boolean;
  devices: Device[];
  employees: Employee[];
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<z.infer<typeof deviceAssignedSchema>>({
    resolver: zodResolver(deviceAssignedSchema),
    defaultValues: data || assignedDeviceDefaultValues,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof deviceAssignedSchema>> = async (
    values: any,
  ) => {
    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateAssingedDevice(values, id);
      } else {
        res = await createAssignedDevice(values);
      }

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
      } else {
        router.push("/admin/device-assigned");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4  "
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="deviceId"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof deviceAssignedSchema>,
                  "deviceId"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(v) => field.onChange(v as string)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map(
                          (device) =>
                            device.id && (
                              <SelectItem value={device.id}>
                                {device.name} ({device.serialNumber})
                              </SelectItem>
                            ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="employeeId"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof deviceAssignedSchema>,
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
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.first_name} {employee.last_name}
                              </SelectItem>
                            ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="assignedDate"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof deviceAssignedSchema>,
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
                            !field.value && "text-muted-foreground",
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
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="status"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof deviceAssignedSchema>,
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
                        {Object.values(AssignedDeviceStatus).map(
                          (status: string, index: number) => (
                            <SelectItem value={status} key={index}>
                              {status}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="remarks"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof deviceAssignedSchema>,
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
        <div className="flex gap-2">
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            {isPending ? (
              <Loader className="w-4 h-4 animate-spin cursor-pointer" />
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

export default DeviceAssignedForm;
