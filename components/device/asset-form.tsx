"use client";

import { assetDefaultValues } from "@/lib/constants";
import { assetSchema } from "@/lib/validators";
import { Asset } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { getAssetType } from "@/lib/actions/asset-type-action";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
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
import { createAsset, updateAsset } from "@/lib/actions/asset-action";

const AssetForm = ({
  data,
  update = false,
}: {
  data?: Asset;
  update: boolean;
}) => {
  const router = useRouter();
  const id = data?.id;

  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: (data ?? assetDefaultValues) as any,
  });

  const [isPending, startTransition] = React.useTransition();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "accessories",
  });

  const [assetTypes, setAssetTypes] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const res = await getAssetType();
      setAssetTypes(res);
    };
    load();
  }, []);

  const onSubmit: SubmitHandler<any> = async (values) => {
    startTransition(async () => {
      let res;

      if (update && id) res = await updateAsset(values, id);
      else res = await createAsset(values);

      if (!res?.success) {
        toast.error(res?.message);
      } else {
        router.push("/admin/asset");
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assetTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asset Type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {assetTypes.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="configuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Configuration</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchaseValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Value</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* WARRANTY */}
        <FormField
          control={form.control}
          name="hasWarranty"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <FormLabel>Has Warranty</FormLabel>
            </FormItem>
          )}
        />

        {/* ACCESSORIES */}
        <div className="border p-4 rounded">
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-6 gap-2 mb-2">
              <Input
                {...form.register(`accessories.${index}.type` as const)}
                placeholder="Type"
              />
              <Input
                {...form.register(`accessories.${index}.make` as const)}
                placeholder="Make"
              />
              <Input
                {...form.register(`accessories.${index}.model` as const)}
                placeholder="Model"
              />
              <Input
                {...form.register(`accessories.${index}.serialNo` as const)}
                placeholder="Serial"
              />
              <Input
                {...form.register(`accessories.${index}.condition` as const)}
                placeholder="Condition"
              />

              <Button type="button" onClick={() => remove(index)}>
                X
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                type: "",
                make: "",
                model: "",
                serialNo: "",
                condition: "Good",
              })
            }
          >
            Add Accessory
          </Button>
        </div>

        {/* REMARKS */}
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : <ArrowRight />}{" "}
          Save
        </Button>
      </form>
    </Form>
  );
};

export default AssetForm;
