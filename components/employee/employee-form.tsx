"use client";

import { employeeSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createEmployee, updateEmployee } from "@/lib/actions/employee";
import { useRouter } from "next/navigation";
import { Status } from "@/lib/generated/prisma/enums";

export default function EmployeeForm({
  data,
  update = false,
  departments = [],
  designations = [],
  locations = [],
}: any) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: data || {
      first_name: "",
      last_name: "",
      email: "",
      phoneNumber: "",
      departmentId: "",
      designationId: "",
      locationId: "",
      hireDate: null,
      status: "ACTIVE",
    },
  });

  const onSubmit = async (values: any) => {
    const res = update
      ? await updateEmployee(values, data?.id)
      : await createEmployee(values);

    if (!res?.success) {
      alert(res?.message);
      return;
    }

    router.push("/admin/employee");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        {/* First Name */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <Input {...field} value={field.value || ""} />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} value={field.value || ""} />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <Input {...field} value={field.value || ""} />
            </FormItem>
          )}
        />

        {/* Department */}
        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Designation */}
        <FormField
          control={form.control}
          name="designationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Joining Date */}
        <FormField
          control={form.control}
          name="hireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joining Date</FormLabel>
              <Input
                type="date"
                value={
                  field.value
                    ? new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  field.onChange(new Date(e.target.value))
                }
              />
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
              <Select
                value={field.value || "ACTIVE"}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                  <SelectItem value={Status.INACTIVE}>
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="col-span-2 flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
