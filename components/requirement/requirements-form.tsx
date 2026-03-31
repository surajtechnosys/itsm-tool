"use client";

import React from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
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
import { getVendors } from "@/lib/actions/vendor";
import { ArrowRight, CalendarIcon, Loader } from "lucide-react";
import { requriementsSchema } from "@/lib/validators";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requirementDefaultValues } from "@/lib/constants";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import {
  createRequirement,
  updateRequirement,
} from "@/lib/actions/requirements";
import { Vendor } from "@/types";
import { Status } from "@/lib/generated/prisma/enums";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";

const RequirementForm = ({
  data,
  vendors,
  update = false,
}: {
  data?: any;
  vendors: Vendor[];
  update: boolean;
}) => {
  const router = useRouter();
  const id = data?.id;

  if(id && typeof data.configuration === "string") {
    data.configuration = JSON.parse(data.configuration)
  }

  const form = useForm<z.infer<typeof requriementsSchema>>({
    resolver: zodResolver(requriementsSchema),
    defaultValues: data || requirementDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "configuration",
  });

  const [isPending, startTransition] = React.useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof requriementsSchema>> = async (
    values: any,
  ) => {
    startTransition(async () => {
      let res;

      const payload = {
        ...values,
      };


      if (update && id) {
        res = await updateRequirement(payload, id);
      } else {
        res = await createRequirement(payload);
      }

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
      } else {
        router.push("/admin/requirements");
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
              name="vendorIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendors</FormLabel>

                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const current = field.value || [];

                        if (current.includes(value)) {
                          field.onChange(
                            current.filter((v: string) => v !== value),
                          );
                        } else {
                          field.onChange([...current, value]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select vendors" />
                      </SelectTrigger>

                      <SelectContent>
                        {vendors.map((v: any) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.vendorCode} — {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  {/* show selected vendors */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((id: string) => {
                      const v = vendors.find((x: any) => x.id === id);
                      return (
                        <span
                          key={id}
                          className="px-2 py-1 rounded text-sm"
                        >
                          {v?.vendorCode}
                        </span>
                      );
                    })}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="model"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof requriementsSchema>,
                  "model"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select warranty type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="TENURE">Tenure</SelectItem>
                        <SelectItem value="TILL_DATE">Till Date</SelectItem>
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
              name="manufatured"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof requriementsSchema>,
                  "manufatured"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Manufatured</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Manufatured" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="warrantyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select warranty type" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="MANUFACTURER">
                          Manufacturer
                        </SelectItem>
                        <SelectItem value="EXTENDED">Extended</SelectItem>
                        <SelectItem value="AMC">AMC</SelectItem>
                        <SelectItem value="ACCIDENTAL_DAMAGE">
                          Accidental Damage
                        </SelectItem>
                        <SelectItem value="REPLACEMENT">Replacement</SelectItem>
                        <SelectItem value="VENDOR_WARRANTY">
                          Vendor Warranty
                        </SelectItem>
                        <SelectItem value="NO_WARRANTY">No Warranty</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex flex-col gap-5'>
            <FormField
              control={form.control}
              name='quotationValidity'
              render={({
                field
              }) => (
                <FormItem>
                  <FormLabel>Returned Date</FormLabel>
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
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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

          {/*  Status   */}
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="status"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof requriementsSchema>,
                  "status"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(v) =>
                        field.onChange(v as Status)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Status.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={Status.INACTIVE}>
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* CONFIGURATION DYNAMIC BLOCK */}
          <div className="col-span-2 border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base font-semibold">
                Specification
              </FormLabel>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ item: "", quantity: "", description: "" })
                }
              >
                + Add Item
              </Button>
            </div>

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-3 gap-3">
                {/* ITEM NAME */}
                <FormField
                  control={form.control}
                  name={`configuration.${index}.item`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* QUANTITY */}
                <FormField
                  control={form.control}
                  name={`configuration.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION */}
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`configuration.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
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
                z.infer<typeof requriementsSchema>,
                "notes"
              >;
            }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={20}
                    className="h-40"
                    placeholder="Enter Notes"
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

export default RequirementForm;


