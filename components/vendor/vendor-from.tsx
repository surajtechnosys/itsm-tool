            "use client";

import React from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
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
import { vendorSchema } from "@/lib/validators";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorDefaultValues } from "@/lib/constants";
import { createVendor, updateVendor } from "@/lib/actions/vendor";
import { toast } from "sonner";
import { VendorStatus } from "@/lib/generated/prisma/enums";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

export interface Vendor {
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  vendorTypeId?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
}

const VendorForm = ({
  data,
  update = false,
}: {
  data?: any;
  update: boolean;
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<z.infer<typeof vendorSchema>>({
    resolver: zodResolver(vendorSchema),
    defaultValues: data || vendorDefaultValues,
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof vendorSchema>> = async (
    values: any,
  ) => {
    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateVendor(values, id);
      } else {
        res = await createVendor(values);
      }

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
      } else {
        router.push("/admin/vendor");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="vendorCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "vendorCode"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Vendor Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "name"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="contactPerson"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "contactPerson"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter vendor contact person"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="phone"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "phone"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "email"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter vendor email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "addressLine1"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter vendor address line 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="addressLine2"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "addressLine2"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter vendor address line 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="city"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "city"
                >;
              }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="state"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "state"
                >;
              }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="postalCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "postalCode"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor postalCode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "country"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="taxId"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "taxId"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Tax Id</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor taxId" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

           <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="website"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "website"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/*  Status   */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="status"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof vendorSchema>,
                  "status"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(v) => field.onChange(v as VendorStatus)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={VendorStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={VendorStatus.INACTIVE}>Inactive</SelectItem>
                        <SelectItem value={VendorStatus.BLACKLISTED}>Blacklisted</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/*  Description   */}
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="notes"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof vendorSchema>,
                "notes"
              >;
            }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={20}
                    className="h-40"
                    placeholder="Enter description"
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

export default VendorForm;
