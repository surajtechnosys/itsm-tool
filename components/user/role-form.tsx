"use client";

import { roleSchema } from "@/lib/validators";
import { Role } from "@/types";
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
import { roleDefaultValues } from "@/lib/constants";
import { createLocation, updateLocation } from "@/lib/actions/location";
import { Textarea } from "../ui/textarea";
import { createRole, updateRole } from "@/lib/actions/role-action";

const RoleForm = ({
  data,
  update = false,
}: {
  data?: Role;
  update: boolean;
}) => {
  const router = useRouter();
  const id: string | undefined = data?.id;

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: data
      ? {
          name: data.name,
          description: data.description,
          status: data.status,
        }
      : roleDefaultValues,
  });

  const [isPending, startTransition] = React.useTransition();
  const [modules, setModules] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/module")
      .then((res) => res.json())
      .then((data) => setModules(data));
  }, []);

  const [selectedModules, setSelectedModules] = React.useState<any[]>([]);

  React.useEffect(() => {
    if ((data as any)?.roleModules) {
      setSelectedModules(
        (data as any).roleModules.map((rm: any) => rm.moduleId),
      );
    }
  }, [data]);

  const onSubmit: SubmitHandler<z.infer<typeof roleSchema>> = async (
    values: any,
  ) => {
    startTransition(async () => {
      let res;

      if (update && id) {
        res = await updateRole(
          {
            ...values,
            modules: selectedModules,
          },
          id,
        );
      } else {
        res = await createRole({
          ...values,
          modules: selectedModules,
        });
      }

      if (!res?.success) {
        toast.error("Error", {
          description: res?.message,
        });
      } else {
        router.push("/admin/role");
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
              name="name"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof roleSchema>,
                  "name"
                >;
              }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
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
                  z.infer<typeof roleSchema>,
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
                        <SelectItem value={Status.ACTIVE}>Active</SelectItem>
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
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof roleSchema>,
                "description"
              >;
            }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={20}
                    className="h-40"
                    placeholder="Enter name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-3">
          <FormLabel>Assign Modules & Permissions</FormLabel>

          {/* ✅ 3 MODULES PER ROW */}
          <div className="grid grid-cols-3 gap-4">
            {modules.map((m) => {
              const selected = selectedModules.find(
                (sm) => sm.moduleId === m.id,
              );

              return (
                <div key={m.id} className="border rounded-md p-3">
                  {/* MODULE NAME */}
                  <div className="font-medium mb-3 text-left">{m.name}</div>

                  {/* ✅ HORIZONTAL PERMISSIONS */}
                  <div className="flex flex-wrap gap-3 justify-left text-spacebetween">
                    {["view", "create", "edit", "delete"].map((perm) => {
                      const key =
                        "can" + perm.charAt(0).toUpperCase() + perm.slice(1);

                      return (
                        <label key={perm} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={selected?.[key] || false}
                            onChange={() => {
                              setSelectedModules((prev) => {
                                const exists = prev.find(
                                  (p) => p.moduleId === m.id,
                                );

                                if (!exists) {
                                  return [
                                    ...prev,
                                    {
                                      moduleId: m.id,
                                      canView: perm === "view",
                                      canCreate: perm === "create",
                                      canEdit: perm === "edit",
                                      canDelete: perm === "delete",
                                    },
                                  ];
                                }

                                return prev.map((p) =>
                                  p.moduleId === m.id
                                    ? {
                                        ...p,
                                        [key]: !p[key],
                                      }
                                    : p,
                                );
                              });
                            }}
                          />
                          {perm}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
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

export default RoleForm;
